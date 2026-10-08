require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crmproject";

// Comma-separated list of frontend URLs allowed to call this API,
// e.g. "https://taskopad.vercel.app,http://localhost:5173"
const defaultOrigins = ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = Array.from(new Set([...defaultOrigins, ...configuredOrigins]));

let dbError = null;

// Reconnect-safe database connection helper (handles serverless, idle timeouts, drops)
async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (mongoose.connection.readyState === 2) {
    // Already in the process of connecting
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
      mongoose.connection.once("error", resolve);
    });
    return mongoose.connection;
  }

  return mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
}

const dbReady = connectToDatabase()
  .then(() => {
    dbError = null;
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    dbError = err.message;
    console.log("❌ Connection Error:", err.message);
  });

app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      if (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === "*") {
        return callback(null, true);
      }
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://localhost:") ||
        origin.endsWith(".vercel.app")
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());

// Database readiness middleware: ensures connection before executing queries
app.use(async (req, res, next) => {
  if (req.method === "OPTIONS" || req.path === "/") {
    return next();
  }

  if (mongoose.connection.readyState !== 1) {
    try {
      await connectToDatabase();
    } catch (err) {
      console.error("❌ MongoDB connection error on request:", err.message);
      return res.status(503).json({
        message: "Database connection failed. Please verify MongoDB server is running and accessible.",
        error: err.message,
      });
    }
  }
  next();
});

const authRouter = require('./routes/authRouter');
const taskRouter = require('./routes/taskRouter');
const leaveRouter = require('./routes/leaveRouter');
const holidayRouter = require('./routes/holidayRouter');
const notificationRouter = require("./routes/notificationRouter");

const DB_STATES = ["disconnected", "connected", "connecting", "disconnecting"];

app.get('/', async (req, res) => {
  try {
    await connectToDatabase();
  } catch (err) {
    dbError = err.message;
  }

  res.json({
    status: "ok",
    database: DB_STATES[mongoose.connection.readyState] || "unknown",
    ...(dbError && { databaseError: dbError }),
    corsOrigin: allowedOrigins,
  });
});

app.use('/auth', authRouter);
app.use('/task', taskRouter);
app.use('/leave', leaveRouter);
app.use('/holiday', holidayRouter);
app.use("/notification", notificationRouter);

// Vercel imports the app; locally we start the server ourselves.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
