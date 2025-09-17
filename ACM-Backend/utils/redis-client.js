// redis-client.js
import redis from "redis";
import logger from "./logger.js";
import dotenv from "dotenv";
dotenv.config();

const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://redis_server:6379",
  // Removed TLS configuration for local Redis container
  // socket: {
  //   tls: true,
  //   rejectUnauthorized: false,
  // },
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("✅ Redis connected successfully");
    logger.info("✅ Redis connection established");
  } catch (err) {
    console.error("❌ Redis connection error:", err.message);
    logger.error("❌ Redis connection error:", err.message);

    // Don't crash the app - allow it to continue without Redis
    console.warn("⚠️  Continuing without Redis cache...");
    logger.warn("⚠️  Continuing without Redis cache...");
  }
}

// Event handlers for Redis client
redisClient.on("error", (err) => {
  console.error("Redis runtime error:", err.message);
  logger.error("Redis runtime error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis client connected to server");
  logger.info("Redis client connected to server");
});

redisClient.on("ready", () => {
  console.log("Redis client ready for operations");
  logger.info("Redis client ready for operations");
});

redisClient.on("end", () => {
  console.log("Redis client disconnected");
  logger.info("Redis client disconnected");
});

redisClient.on("reconnecting", () => {
  console.log("Redis client reconnecting...");
  logger.info("Redis client reconnecting...");
});

// Helper functions for safe Redis operations
export const safeRedisGet = async (key) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected - cannot GET key: ${key}`);
      return null;
    }
    return await redisClient.get(key);
  } catch (error) {
    console.warn(`Redis GET error for key ${key}:`, error.message);
    logger.warn(`Redis GET error for key ${key}:`, error.message);
    return null;
  }
};

export const safeRedisSet = async (key, value, expiry = 3600) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected - cannot SET key: ${key}`);
      return false;
    }
    await redisClient.setEx(key, expiry, JSON.stringify(value));
    return true;
  } catch (error) {
    console.warn(`Redis SET error for key ${key}:`, error.message);
    logger.warn(`Redis SET error for key ${key}:`, error.message);
    return false;
  }
};

export const safeRedisDel = async (key) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected - cannot DELETE key: ${key}`);
      return false;
    }
    await redisClient.del(key);
    return true;
  } catch (error) {
    console.warn(`Redis DEL error for key ${key}:`, error.message);
    logger.warn(`Redis DEL error for key ${key}:`, error.message);
    return false;
  }
};

export const safeRedisExists = async (key) => {
  try {
    if (!redisClient.isOpen) {
      return false;
    }
    const exists = await redisClient.exists(key);
    return exists === 1;
  } catch (error) {
    console.warn(`Redis EXISTS error for key ${key}:`, error.message);
    logger.warn(`Redis EXISTS error for key ${key}:`, error.message);
    return false;
  }
};

export const safeRedisSetHash = async (key, field, value, expiry = 3600) => {
  try {
    if (!redisClient.isOpen) {
      console.warn(`Redis not connected - cannot HSET key: ${key}`);
      return false;
    }
    await redisClient.hSet(key, field, JSON.stringify(value));
    if (expiry > 0) {
      await redisClient.expire(key, expiry);
    }
    return true;
  } catch (error) {
    console.warn(
      `Redis HSET error for key ${key}, field ${field}:`,
      error.message
    );
    logger.warn(
      `Redis HSET error for key ${key}, field ${field}:`,
      error.message
    );
    return false;
  }
};

export const safeRedisGetHash = async (key, field = null) => {
  try {
    if (!redisClient.isOpen) {
      return null;
    }
    if (field) {
      const value = await redisClient.hGet(key, field);
      return value ? JSON.parse(value) : null;
    } else {
      const hash = await redisClient.hGetAll(key);
      const parsedHash = {};
      for (const [k, v] of Object.entries(hash)) {
        try {
          parsedHash[k] = JSON.parse(v);
        } catch {
          parsedHash[k] = v;
        }
      }
      return parsedHash;
    }
  } catch (error) {
    console.warn(`Redis HGET error for key ${key}:`, error.message);
    logger.warn(`Redis HGET error for key ${key}:`, error.message);
    return null;
  }
};

// Graceful shutdown handler
process.on("SIGINT", async () => {
  console.log("Shutting down Redis client...");
  try {
    await redisClient.quit();
    console.log("Redis client closed");
  } catch (error) {
    console.error("Error closing Redis client:", error.message);
  }
  process.exit(0);
});

export { redisClient, connectRedis };
