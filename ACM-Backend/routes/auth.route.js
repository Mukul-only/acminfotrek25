import express from "express";
import {
  signIn,
  signOut,
  signUpRequest,
  signUpVerify,
  resetPassword,
  forgotPassword,
} from "../controllers/authController.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import dbGuard from "../middleware/dbGuard.js"; // ✅ Add this import

const router = express.Router();

// ✅ Add dbGuard middleware to all database-dependent routes
router.post("/signup/request", dbGuard, signUpRequest);
router.post("/signup/verify", dbGuard, signUpVerify);
router.post("/signin", dbGuard, signIn);
router.post("/signout", AuthMiddleware, dbGuard, signOut);
router.post("/reset-password", dbGuard, resetPassword);
router.post("/forgot-password", dbGuard, forgotPassword);

export default router;
