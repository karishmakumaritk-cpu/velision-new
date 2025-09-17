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

// track DB status via mongoose.connection.readyState
let dbConnected = false;
mongoose.connection.on("connected", () => {
  dbConnected = true;
  console.log("MongoDB connection established");
});
mongoose.connection.on("disconnected", () => {
  dbConnected = false;
  console.warn("MongoDB disconnected");
});
mongoose.connection.on("error", (err) => {
  dbConnected = false;
  console.error("MongoDB connection error:", err);
});

// Attempt connection unless explicitly skipped
if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set in environment.");
  console.warn(" - For local development you can keep /workspaces/velision-new/server/.env.");
  console.warn(" - For deployments (Render, Heroku, etc.) set the MONGO_URI in the service environment variables.");
  if (skipDb) {
    console.warn("SKIP_DB_ON_MISSING is true; skipping DB connection attempt.");
  } else {
    // Try fallback local DB (useful in dev). Do not exit on failure.
    const fallback = "mongodb://127.0.0.1:27017/velision";
    console.log("Attempting fallback local DB:", fallback);
    mongoose
      .connect(fallback)
      .catch((err) => {
        console.error("Fallback local DB connection failed:", err);
        // keep process running; DB endpoints will return 503 until connected
      });
  }
} else {
  // Use provided URI; do not exit the process on failure
  mongoose.connect(mongoEnvVar).catch((err) => {
    console.error("MongoDB connection attempt failed:", err);
    // keep process running; DB endpoints will return 503 until connected
  });
}

// helper to check DB availability from routes
function isDbAvailable() {
  // mongoose.connection.readyState === 1 means connected
  return mongoose.connection && mongoose.connection.readyState === 1;
}
app.set("isDbAvailable", isDbAvailable);

// Routes
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Velision API running");
});

// API routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
