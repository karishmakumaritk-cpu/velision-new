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

// Determine MongoDB URI
const mongoEnvVar = process.env.MONGO_URI || process.env.MONGODB_URI;
const skipDb = process.env.SKIP_DB_ON_MISSING === "true";

if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set in environment.");
  console.warn(" - For local development you can keep /workspaces/velision-new/server/.env.");
  console.warn(" - For deployments (Render, Heroku, etc.) set the MONGO_URI in the service environment variables.");
  if (process.env.NODE_ENV === "production" && !skipDb) {
    console.error("No MongoDB URI provided in production. Exiting.");
    process.exit(1);
  }
  if (!skipDb) {
    // Use fallback for local dev
    mongoose
      .connect("mongodb://127.0.0.1:27017/velision", { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => console.log("MongoDB connected (fallback local)"))
      .catch((err) => {
        console.error("MongoDB connection error (fallback local):", err);
        if (process.env.NODE_ENV === "production") process.exit(1);
      });
  } else {
    console.warn("SKIP_DB_ON_MISSING is true, skipping DB connection.");
  }
} else {
  // Use provided URI
  mongoose
    .connect(mongoEnvVar, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      if (process.env.NODE_ENV === "production" && !skipDb) process.exit(1);
    });
}

// Routes
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Velision API running");
});

// API routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
