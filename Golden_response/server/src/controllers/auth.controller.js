import crypto from "crypto";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";
import { sendMail } from "../config/mailer.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanObject } from "../utils/sanitize.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

const userPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

export const register = asyncHandler(async (req, res) => {
  const body = cleanObject(req.body);
  const { name, email, phone, role, password } = body;

  if (!name || !email || !role || !password) {
    res.status(400);
    throw new Error("Name, email, role and password are required");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }
  if (!["student", "educator"].includes(role)) {
    res.status(400);
    throw new Error("Role must be student or educator");
  }
  if (!validator.isStrongPassword(password, { minSymbols: 0 })) {
    res.status(400);
    throw new Error("Password must be at least 8 characters and include uppercase, lowercase and a number");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409);
    throw new Error("Email is already registered");
  }

  const user = await User.create({ name, email, phone, role, password });
  res.status(201).json({
    success: true,
    message: "Account created successfully",
    token: signToken(user._id),
    user: userPayload(user)
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = cleanObject(req.body);
  if (!email || !password || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Valid email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  res.json({
    success: true,
    message: "Logged in successfully",
    token: signToken(user._id),
    user: userPayload(user)
  });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = cleanObject(req.body);
  if (!email || !validator.isEmail(email)) {
    res.status(400);
    throw new Error("Valid email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: true, message: "If the email exists, a reset link has been sent" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  user.resetPasswordExpires = Date.now() + 1000 * 60 * 15;
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
  await sendMail({
    to: user.email,
    subject: "Reset your Ethara Learn password",
    html: `<p>Use this secure link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>This link expires in 15 minutes.</p>`
  });

  res.json({ success: true, message: "Password reset link sent" });
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = cleanObject(req.body);

  if (!validator.isStrongPassword(password || "", { minSymbols: 0 })) {
    res.status(400);
    throw new Error("Password must be at least 8 characters and include uppercase, lowercase and a number");
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error("Reset token is invalid or expired");
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: userPayload(req.user) });
});
