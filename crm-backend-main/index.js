require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/crmproject";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.log("❌ Connection Error:");
    console.log(err);
  });

app.use(cors());
app.use(express.json());

const authRouter = require('./routes/authRouter');
const taskRouter = require('./routes/taskRouter');
const leaveRouter = require('./routes/leaveRouter');
const holidayRouter = require('./routes/holidayRouter');
const notificationRouter = require("./routes/notificationRouter");

app.use('/auth', authRouter);
app.use('/task', taskRouter);
app.use('/leave', leaveRouter);
app.use('/holiday', holidayRouter);
app.use("/notification", notificationRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
