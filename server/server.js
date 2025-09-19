import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";

// Load .env
dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
});

const app = express();
app.use(cors());
app.use(express.json());

// Trust proxy so req.secure and x-forwarded-proto are reliable behind load balancers
app.set("trust proxy", true);

// Add security headers including HSTS (maxAge 1 year). In development you can disable HSTS by NODE_ENV !== 'production'.
app.use(
  helmet({
    // enable HSTS in production only via helmet.hsts below
  })
);

// apply HSTS manually in production (helmet.hsts options)
if (process.env.NODE_ENV === "production") {
  app.use(
    helmet.hsts({
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true,
    })
  );
}

// Redirect HTTP to HTTPS when in production (use X-Forwarded-Proto from proxy)
app.use((req, res, next) => {
  const isSecure =
    req.secure ||
    (req.headers && req.headers["x-forwarded-proto"] && req.headers["x-forwarded-proto"].split(",")[0] === "https");
  if (process.env.NODE_ENV === "production" && !isSecure) {
    // Validate host header
    const host = req.headers.host;
    // Host must be a non-empty string and match basic hostname pattern
    const validHost = typeof host === "string" && /^[a-zA-Z0-9.-]+(:\d+)?$/.test(host);
    if (validHost) {
      return res.redirect(301, `https://${host}${req.originalUrl}`);
    } else {
      // Optionally log the error for debugging
      console.warn("Invalid or missing host header for HTTPS redirect:", host);
      // Fallback: send 400 Bad Request or redirect to a default domain
      return res.status(400).send("Bad Request: Invalid Host Header");
      // Or, to redirect to a default domain:
      // return res.redirect(301, `https://example.com${req.originalUrl}`);
    }
  }
  next();
});

const NODE_ENV = process.env.NODE_ENV || "development";
const skipDb = process.env.SKIP_DB_ON_MISSING === "true";
const rawEnvValue = process.env.MONGO_URI ?? process.env.MONGODB_URI ?? null;

function sanitizeEnvValue(val) {
  if (typeof val !== "string") return null;
  // remove surrounding quotes and whitespace
  return val.replace(/^["']|["']$/g, "").trim() || null;
}
function isValidMongoUri(val) {
  return typeof val === "string" && (val.startsWith("mongodb://") || val.startsWith("mongodb+srv://"));
}

let mongoEnvVar = sanitizeEnvValue(rawEnvValue);

if (mongoEnvVar && !isValidMongoUri(mongoEnvVar)) {
  console.error("Invalid MONGO_URI scheme detected. Expected 'mongodb://' or 'mongodb+srv://'.");
  console.error("Provided MONGO_URI (trimmed):", mongoEnvVar.slice(0, 60) + (mongoEnvVar.length > 60 ? "..." : ""));
  // Treat as missing so we don't pass an invalid string to mongoose
  mongoEnvVar = null;
}

if (!mongoEnvVar) {
  console.warn("Warning: MONGO_URI not set or invalid in environment.");
  console.warn(" - For local development keep /workspaces/velision-new/server/.env or set a valid MONGO_URI.");
  console.warn(" - For deployments (Render, Heroku, etc.) set MONGO_URI in the service environment variables.");
  if (skipDb) {
    console.warn("SKIP_DB_ON_MISSING=true — skipping DB connection attempt.");
  } else if (NODE_ENV === "production") {
    // CHANGED: do not exit in production; continue running and return 503 on DB routes.
    console.warn("Running in production without a valid MONGO_URI. The server will continue running, but DB endpoints will return 503 until a DB is available.");
  } else {
    console.info("No valid MONGO_URI found — will attempt fallback local DB for development.");
  }
}

// Decide connection URI: prefer validated env var; fallback to local only when allowed
const connectUri = mongoEnvVar || (!skipDb && NODE_ENV !== "production" ? "mongodb://127.0.0.1:27017/velision" : null);

if (connectUri) {
  mongoose
    .connect(connectUri, { autoIndex: true })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      // Do not exit the process; DB endpoints will return 503 until a connection is established.
    });
} else {
  console.warn("No MongoDB connection attempted (connectUri is null). DB endpoints will return 503 until configured.");
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
