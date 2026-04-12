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
    // Avoid endless reconnect loops in local dev when Redis is not running.
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
  res.send("Working");
});

app.use("/api/auth", require("./routes/auth"));

function startServer(initialPort) {
  const maxAttempts = 10;
  let currentPort = initialPort;

  function tryListen() {
    const server = app.listen(currentPort, () => {
      console.log(`Server running on port ${currentPort}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE" && currentPort < initialPort + maxAttempts) {
        console.warn(`Port ${currentPort} is in use. Trying port ${currentPort + 1}...`);
        currentPort += 1;
        tryListen();
        return;
      }

      console.error("Server failed to start:", err.message);
      process.exit(1);
    });
  }

  tryListen();
}
startServer(port);

