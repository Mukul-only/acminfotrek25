import express from "express";
import {
  signIn,
  signOut,
  signUpRequest,
  signUpVerify,
  resetPassword,
  forgotPassword,
  beaconSignOut,
} from "../controllers/authController.js";
import { AuthMiddleware } from "../middleware/auth.middleware.js";
import dbGuard from "../middleware/dbGuard.js";
const router = express.Router();
router.post("/signup/request", dbGuard, signUpRequest);
router.post("/signup/verify", dbGuard, signUpVerify);
router.post("/signin", dbGuard, signIn);
router.post("/signout", AuthMiddleware, dbGuard, signOut);
router.post("/reset-password", dbGuard, resetPassword);
router.post("/forgot-password", dbGuard, forgotPassword);
router.post("/beacon-signout", dbGuard, beaconSignOut);

export default router;
