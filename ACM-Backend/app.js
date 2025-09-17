import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import connectWithRetry from "./utils/db.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import registerRoutes from "./routes/register.route.js";
import { HttpException } from "./utils/HttpException.js"; // ✅ ADDED: Import HttpException

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectWithRetry();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Health check endpoint
app.get("/health", async (req, res) => {
  try {
    const mongoose = await import("mongoose");
    const dbState = mongoose.default.connection.readyState;
    const states = ["disconnected", "connected", "connecting", "disconnecting"];

    res.json({
      status: "healthy",
      database: {
        state: states[dbState],
        host: mongoose.default.connection.host,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "unhealthy",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

// Middleware for routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event", registerRoutes);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js server!");
});

console.log("Server setup complete.");

// ✅ ADDED: Global Error Handling Middleware
// This must be the last middleware in the chain.
app.use((error, req, res, next) => {
  if (error instanceof HttpException) {
    return res.status(error.status).json({ error: error.message });
  }

  // For any other errors, log them and send a generic 500 response.
  logger.error(`An unexpected error occurred: ${error.message}`, {
    stack: error.stack,
  });
  return res.status(500).json({ error: "Internal Server Error" });
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  logger.info("Server is starting...");
  console.log(`Server is running on port ${PORT}`);
});
