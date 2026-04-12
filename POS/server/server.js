require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();
const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/posDB";
const redisUrl =
  process.env.REDIS_URL ||
  `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

app.use(express.json());

mongoose
  .connect(mongoUri)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err.message));

const redisClient = redis.createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: () => false
  }
});

redisClient.on("error", (err) => {
  console.warn("Redis unavailable. Continuing without Redis:", err.message);
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("Redis connected");
  } catch (err) {
    console.warn("Skipping Redis connection:", err.message);
  }
}

connectRedis();

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/auth", require("./routes/auth"));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
