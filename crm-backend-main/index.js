require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

for (const key of ["MONGO_URI", "JWT_SECRET"]) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;

// Comma-separated list of frontend URLs allowed to call this API,
// e.g. "https://taskopad.vercel.app,http://localhost:5173"
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ Connection Error:");
    console.log(err);
  });

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

const authRouter = require('./routes/authRouter');
const taskRouter = require('./routes/taskRouter');
const leaveRouter = require('./routes/leaveRouter');
const holidayRouter = require('./routes/holidayRouter');

app.get('/', (req, res) => res.json({ status: "ok" }));

app.use('/auth', authRouter);
app.use('/task', taskRouter);
app.use('/leave', leaveRouter);
app.use('/holiday', holidayRouter);

// Vercel imports the app; locally we start the server ourselves.
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
}

module.exports = app;
