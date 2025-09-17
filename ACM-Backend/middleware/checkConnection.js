import mongoose from "mongoose";
import logger from "../logger.js";

const checkConnection = (req, res, next) => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState !== 1) {
    const states = ["disconnected", "connected", "connecting", "disconnecting"];
    logger.warn(`Database connection issue: ${states[connectionState]}`);

    return res.status(503).json({
      error: "Service temporarily unavailable",
      message: "Database connection issue",
      status: states[connectionState],
    });
  }

  next();
};

export default checkConnection;
