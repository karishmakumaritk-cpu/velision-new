import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Determine MongoDB URI
const mongoEnvVar = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set in environment.");
  console.warn(" - For local development you can keep /workspaces/velision-new/server/.env.");
  console.warn(" - For deployments (Render, Heroku, etc.) set the MONGO_URI in the service environment variables.");
  if (process.env.NODE_ENV === "production") {
    console.error("No MongoDB URI provided in production. Exiting.");
    process.exit(1);
  }
}

// Use provided URI or fallback to local dev DB
const mongoUri = mongoEnvVar || "mongodb://127.0.0.1:27017/velision";

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    // In production, fail fast. In development, continue so the server can still serve static pages / endpoints.
    if (process.env.NODE_ENV === "production") process.exit(1);
  });

// Routes
import userRoutes from "./routes/userRoutes.js";

app.get("/", (req, res) => {
  res.send("Velision API running");
});

// API routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
