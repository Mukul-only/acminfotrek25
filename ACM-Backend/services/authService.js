import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.model.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import crypto from "crypto";

dotenv.config();

const otpStore = new Map();

// --- HELPER FUNCTIONS ---
function generateRandomPassword() {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const passwordLength = Math.floor(Math.random() * 12) + 9;
  let newPassword = "";
  for (let i = 0; i < passwordLength; i++) {
    newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return newPassword;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// --- EMAIL CONFIGURATION ---
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// --- EMAIL SENDING FUNCTION ---
async function sendEmail(options) {
  const transporter = createTransporter();

  try {
    console.log(`[Email Service] Sending email to ${options.to}`);

    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[Email Service] ✅ Email sent successfully to ${options.to}. Message ID: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(`[Email Service] ❌ Failed to send email:`, error);
    throw new Error("Failed to send email. Please try again.");
  }
}

// --- SPECIALIZED EMAIL FUNCTIONS ---
async function sendOTPEmail(email, otp) {
  await sendEmail({
    to: email,
    subject: "Your INFOTREK'25 OTP Code",
    text: `Your One-Time Password (OTP) is: ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">INFOTREK'25 Verification</h2>
        <p style="color: #666; text-align: center;">Your One-Time Password (OTP) is:</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f8f9fa; padding: 15px 25px; border-radius: 8px; border: 2px solid #e9ecef;">${otp}</span>
        </div>
        <p style="color: #666; text-align: center;">This code will expire in 10 minutes.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #999; font-size: 12px; text-align: center;">If you didn't request this code, please ignore this email.</p>
      </div>
    `,
  });
}

// --- AUTH SERVICES ---

export const requestSignUpOTP = async ({
  username,
  dept,
  branch,
  mobno,
  rollNumber,
  email,
  password,
}) => {
  try {
    console.log(`[requestSignUpOTP] Processing request for: ${email}`);

    const existing = await User.findOne({
      $or: [{ email }, { username }, { rollNumber }, { mobno }],
    });

    if (existing) {
      throw new Error(
        "User with this email, mobile number, username, or roll number already exists"
      );
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    otpStore.set(email, {
      username,
      mobno,
      dept,
      branch,
      rollNumber,
      password,
      otp,
      expiresAt,
    });

    await sendOTPEmail(email, otp);

    console.log(`[requestSignUpOTP] ✅ OTP sent successfully to ${email}`);
    return { message: "OTP sent to your email address" };
  } catch (error) {
    console.error(`[requestSignUpOTP] ❌ Error:`, error.message);
    throw error;
  }
};

export const verifySignUpOTP = async ({ email, otp }) => {
  const record = otpStore.get(email);

  if (!record) {
    throw new Error("No OTP found for this email or OTP has expired");
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    throw new Error("OTP has expired. Please request a new one.");
  }

  if (record.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(record.password, 10);
  const user = new User({
    username: record.username,
    rollNumber: record.rollNumber,
    mobno: record.mobno,
    dept: record.dept,
    branch: record.branch,
    email,
    password: hashedPassword,
  });

  await user.save();
  otpStore.delete(email);

  return { message: "Account created successfully" };
};

export const handleSignIn = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw new Error("Invalid credentials");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });
  return { token, user };
};

export const handleSignOut = async () => {
  return { message: "Sign out successful" };
};

export const forgotPasswordService = async (email) => {
  try {
    console.log(`[forgotPasswordService] Processing request for: ${email}`);

    const user = await User.findOne({ email: email.toLowerCase() });

    // ✅ MODIFIED: Check if user exists and throw an error if not.
    if (!user) {
      console.log(
        `[forgotPasswordService] ❌ User not found for email: ${email}`
      );
      throw new Error(
        "This email is not registered with us. Please check the email or sign up."
      );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset Request - INFOTREK'25",
      text: `You requested a password reset. Click this link to reset your password: ${resetURL}\n\nThis link will expire in 1 hour.\n\nIf you didn't request this, please ignore this email.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Password Reset</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; color: #374151; margin-bottom: 20px;">
              Hello,
            </p>
            
            <p style="font-size: 16px; color: #374151; margin-bottom: 25px;">
              We received a request to reset your password for your INFOTREK'25 account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetURL}" 
                 style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 25px;">
              This link will expire in 1 hour for security reasons.
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 15px;">
              If you didn't request this password reset, you can safely ignore this email.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;">
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
              INFOTREK'25 Team<br>
              This is an automated message, please do not reply.
            </p>
          </div>
        </div>
      `,
    });

    console.log(
      `[forgotPasswordService] ✅ Reset email sent successfully to ${email}`
    );

    // ✅ MODIFIED: The successful return message is now only sent when the user is found.
    return {
      message: "A password reset link has been sent to your email address.",
    };
  } catch (error) {
    // Re-throw the error so the controller can catch it and send a proper response
    throw error;
  }
};

export const resetPasswordService = async (token, newPassword) => {
  try {
    console.log(
      `[resetPasswordService] Processing reset with token: ${token?.substring(
        0,
        8
      )}...`
    );

    if (!token || !newPassword) {
      throw new Error("Token and new password are required");
    }

    if (newPassword.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log(
      `[resetPasswordService] ✅ Password reset successful for user: ${user.email}`
    );

    return {
      message: "Password reset successful",
      email: user.email,
    };
  } catch (error) {
    console.error(`[resetPasswordService] ❌ Error:`, error.message);
    throw error;
  }
};
