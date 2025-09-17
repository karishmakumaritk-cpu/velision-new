import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
});

const app = express();
app.use(cors());
app.use(express.json());

// Determine DB config
const NODE_ENV = process.env.NODE_ENV || "development";
const skipDb = process.env.SKIP_DB_ON_MISSING === "true";
const mongoEnvVar = process.env.MONGO_URI || process.env.MONGODB_URI || null;

if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set in environment.");
  console.warn(" - For local development keep /workspaces/velision-new/server/.env or set MONGO_URI.");
  console.warn(" - For deployments (Render, Heroku, etc.) set MONGO_URI in service environment variables.");
  if (skipDb) {
    console.warn("SKIP_DB_ON_MISSING=true — skipping DB connection attempt.");
  } else if (NODE_ENV === "production") {
    console.warn("Running in production without MONGO_URI — server will continue running but DB endpoints will return 503 until a DB connects.");
  } else {
    console.info("No MONGO_URI found — will attempt fallback local DB for development.");
  }
}

// Decide whether to attempt connection
const connectUri = mongoEnvVar || (!skipDb && NODE_ENV !== "production" ? "mongodb://127.0.0.1:27017/velision" : null);

if (connectUri) {
  mongoose
    .connect(connectUri, { autoIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      // Do not exit; keep process running. DB endpoints will return 503 until connected.
    });
} else {
  console.warn("No MongoDB connection attempted (connectUri is null).");
}

// Track DB availability using mongoose.connection.readyState
function isDbAvailable() {
  // readyState === 1 means connected
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// Routes
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Velision API running");
});

// attach helper to requests
app.use((req, _res, next) => {
  req.isDbAvailable = isDbAvailable;
  next();
});

// API routes
app.use("/api/users", userRoutes);

// Health endpoints
app.get("/health", (_req, res) => res.json({ status: "ok", dbConnected: isDbAvailable() }));
app.get("/health/db", (_req, res) => {
  if (isDbAvailable()) return res.json({ db: "connected" });
  return res.status(503).json({ db: "unavailable" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
