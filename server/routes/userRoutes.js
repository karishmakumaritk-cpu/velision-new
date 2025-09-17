import express from "express";
import mongoose from "mongoose";
import User from "../models/User.js";

const router = express.Router();

function dbAvailable() {
  // mongoose.connection.readyState === 1 means connected
  return mongoose.connection && mongoose.connection.readyState === 1;
}

// GET all users
router.get("/", async (req, res) => {
  if (!dbAvailable()) {
    return res.status(503).json({ error: "Database unavailable" });
  }
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
router.post("/", async (req, res) => {
  if (!dbAvailable()) {
    return res.status(503).json({ error: "Database unavailable" });
  }
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
