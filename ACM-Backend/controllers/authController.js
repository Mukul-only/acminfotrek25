import {
  handleSignIn,
  handleSignOut,
  requestSignUpOTP,
  verifySignUpOTP,
  forgotPasswordService,
  resetPasswordService,
} from "../services/authService.js";
import logger from "../utils/logger.js";

// Enhanced error handler for MongoDB issues
const handleMongoError = (error, res, defaultMessage) => {
  if (
    error.name === "MongoNetworkError" ||
    error.message.includes("client is closed") ||
    error.message.includes("topology was destroyed") ||
    error.message.includes("connection") ||
    error.code === "ENOTFOUND"
  ) {
    logger.error(`Database connection error: ${error.message}`);
    return res.status(503).json({
      error: "Database connection issue",
      message: "Please try again in a moment",
    });
  }

  // Fallback for unexpected errors
  logger.error(defaultMessage, error);
  return res.status(500).json({ error: "An unexpected error occurred." });
};

// Sign Up Request Controller
export const signUpRequest = async (req, res) => {
  try {
    const result = await requestSignUpOTP(req.body);
    res.status(200).json(result);
  } catch (error) {
    if (error.message.includes("already exists")) {
      return res.status(409).json({ error: error.message });
    }
    return handleMongoError(
      error,
      res,
      `SignUp Request Error: ${error.message}`
    );
  }
};

// Sign Up Verify Controller
export const signUpVerify = async (req, res) => {
  try {
    const result = await verifySignUpOTP(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (
      error.message.includes("Invalid OTP") ||
      error.message.includes("expired")
    ) {
      return res.status(400).json({ error: error.message });
    }
    return handleMongoError(
      error,
      res,
      `SignUp Verify Error: ${error.message}`
    );
  }
};

// Sign In Controller
export const signIn = async (req, res) => {
  try {
    const result = await handleSignIn(req.body);
    res
      .status(200)
      .json({ message: "User signed in successfully", data: result });
  } catch (error) {
    if (
      error.message.includes("User not found") ||
      error.message.includes("Invalid credentials")
    ) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    return handleMongoError(error, res, `SignIn Error: ${error.message}`);
  }
};

// Sign Out Controller
export const signOut = async (req, res) => {
  try {
    const result = await handleSignOut(req.body);
    res
      .status(200)
      .json({ message: "User signed out successfully", data: result });
  } catch (error) {
    logger.error(`SignOut Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Forgot Password Controller
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: "Email is required",
      });
    }

    const result = await forgotPasswordService(email);

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    // This catches the "This email is not registered" error from the service
    if (error.message.includes("not registered")) {
      return res.status(404).json({ error: error.message });
    }
    return handleMongoError(
      error,
      res,
      `Forgot Password Error: ${error.message}`
    );
  }
};

// Reset Password Controller
export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: "Token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Password must be at least 6 characters long",
      });
    }

    const result = await resetPasswordService(token, newPassword);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      data: result,
    });
  } catch (error) {
    // ✅ MODIFIED: Specifically handle the invalid token error with a 400 status
    if (error.message.includes("Invalid or expired reset token")) {
      return res
        .status(400)
        .json({
          error:
            "This password reset link is invalid or has already been used. Please request a new one.",
        });
    }
    // For other errors, use the appropriate handler
    return handleMongoError(
      error,
      res,
      `Reset Password Error: ${error.message}`
    );
  }
};
