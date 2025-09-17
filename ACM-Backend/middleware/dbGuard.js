import mongoose from "mongoose";
import logger from "../utils/logger.js";

const dbGuard = (req, res, next) => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState !== 1) {
    // 1 = connected
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    logger.warn(`Database connection issue: ${states[connectionState]}`);

    return res.status(503).json({
      error: "Service temporarily unavailable",
      message: "Database connection issue, please try again shortly",
      status: states[connectionState],
    });
  }

  next();
};

export default dbGuard;
