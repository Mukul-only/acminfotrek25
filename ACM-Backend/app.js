// File: ACM-Backend/app.js

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import logger from "./utils/logger.js";
import connectWithRetry from "./utils/db.js";
import authRoutes from "./routes/auth.route.js";
import adminRoutes from "./routes/admin.route.js";
import registerRoutes from "./routes/register.route.js";
import { HttpException } from "./utils/HttpException.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

connectWithRetry();

// --- START: MODIFIED SECTION ---

// Define the exact origins that are allowed to connect.
// This is a critical security measure.
// IMPORTANT: Replace 'http://localhost:5173' if your frontend runs on a different port.
const allowedOrigins = [
  "http://localhost:5173",
  "https://acminfotrek25.netlify.app",
  "https://infotrek25.tech",
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests that have an origin specified in our list.
    // Also allows requests with no origin (like Postman, mobile apps).
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  // This is the crucial option that allows the browser to send credentials
  // (like cookies or authorization headers) with cross-origin requests.
  credentials: true,
};

// Use the new, more secure CORS options.
// This MUST come before your routes.
app.use(cors(corsOptions));

// This is still needed to parse JSON bodies.
// Note: express.json() is the modern replacement for bodyParser.json()
// but bodyParser will still work fine.
app.use(bodyParser.json());

// --- END: MODIFIED SECTION ---

// Health check route (unchanged)
app.get("/api/health", async (req, res) => {
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

// Middleware for routes (unchanged)
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/event", registerRoutes);

// Routes (unchanged)
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js server!");
});

console.log("Server setup complete.");

// Error handling middleware (unchanged)
app.use((error, req, res, next) => {
  if (error instanceof HttpException) {
    return res.status(error.status).json({ error: error.message });
  }

  logger.error(`An unexpected error occurred: ${error.message}`, {
    stack: error.stack,
  });
  return res.status(500).json({ error: "Internal Server Error" });
});

// Start the server (unchanged)
app.listen(PORT, "0.0.0.0", () => {
  logger.info("Server is starting...");
  logger.info(`Server is running on port ${PORT}`);
});
