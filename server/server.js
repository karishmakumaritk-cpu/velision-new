import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
if (!process.env.MONGO_URI) {
  console.error("MONGO_URI not set in .env");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
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
