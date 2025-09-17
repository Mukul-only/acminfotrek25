import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const connectWithRetry = () => {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) {
    logger.error("MONGO_URI is not defined in the environment variables.");
    process.exit(1);
  }

  // Note: Mongoose v6+ no longer requires the useNewUrlParser and useUnifiedTopology options.
  const options = {};

  logger.info("Attempting to connect to MongoDB...");

  mongoose
    .connect(mongoURI, options)
    .then(() => {
      logger.info(`MongoDB Connected: ${mongoose.connection.host}`);
    })
    .catch((err) => {
      logger.error(
        `MongoDB connection error: ${err.message}. Retrying in 5 seconds...`
      );
      setTimeout(connectWithRetry, 5000);
    });
};

export default connectWithRetry;
