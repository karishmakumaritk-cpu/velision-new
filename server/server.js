import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config({
  // ensure we load the .env located alongside this file, regardless of cwd
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
});

const app = express();
app.use(cors());
app.use(express.json());

// Determine MongoDB URI and flags
const mongoEnvVar = process.env.MONGO_URI || process.env.MONGODB_URI;
const skipDb = process.env.SKIP_DB_ON_MISSING === "true";
const NODE_ENV = process.env.NODE_ENV || "development";

if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set in environment.");
  console.warn(" - For local development keep /workspaces/velision-new/server/.env or set MONGO_URI.");
  console.warn(" - For deployments (Render, Heroku, etc.) set MONGO_URI in service environment variables.");
  if (skipDb) {
    console.warn("SKIP_DB_ON_MISSING=true — skipping DB connection attempt.");
  } else {
    console.info("Will attempt fallback local DB in non-production; in production the app will continue running but DB endpoints return 503 until a DB is available.");
  }
}

// Track DB status via mongoose connection readyState
function isDbAvailable() {
  // 1 = connected
  return mongoose.connection && mongoose.connection.readyState === 1;
}

mongoose.connection.on("connected", () => {
  console.log("MongoDB connected");
});
mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Attempt connection unless explicitly skipped
if (!skipDb) {
  const connectUri = mongoEnvVar || (NODE_ENV === "production" ? null : "mongodb://127.0.0.1:27017/velision");

  if (!connectUri) {
    // No URI available and we're not allowed to connect — continue without DB.
    console.warn("No MongoDB URI provided and not allowed to fallback. DB operations will return 503.");
  } else {
    mongoose
      .connect(connectUri, { autoIndex: true })
      .catch((err) => {
        // Log error but DO NOT exit — app will keep running and routes will handle DB-unavailable state.
        console.error("Initial MongoDB connection attempt failed:", err);
      });
  }
} else {
  console.warn("SKIP_DB_ON_MISSING=true — DB connection intentionally skipped.");
}

// Routes
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Velision API running");
});

// Provide middleware to expose DB availability in requests
app.use((req, _res, next) => {
  req.isDbAvailable = isDbAvailable;
  next();
});

// API routes
app.use("/api/users", userRoutes);

// Simple health check for readiness (returns 200 even if DB missing, use /health/db for DB-specific check)
app.get("/health", (_req, res) => res.json({ status: "ok", dbConnected: isDbAvailable() }));

// DB health endpoint
app.get("/health/db", (_req, res) => {
  if (isDbAvailable()) return res.json({ db: "connected" });
  return res.status(503).json({ db: "unavailable" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
