import crypto from "crypto";
import validator from "validator";
import Course from "../models/Course.js";
import SupportTicket from "../models/SupportTicket.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanObject } from "../utils/sanitize.js";

export const createTicket = asyncHandler(async (req, res) => {
  const body = cleanObject(req.body);
  const { name, email, phone, courseId, issue } = body;

  if (!name || !email || !phone || !courseId || !issue) {
    res.status(400);
    throw new Error("Name, email, phone, course ID and issue are required");
  }
  if (!validator.isEmail(email)) {
    res.status(400);
    throw new Error("Please enter a valid email");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const token = `ETH-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
  const ticket = await SupportTicket.create({
    token,
    student: req.user?._id,
    name,
    email,
    phone,
    courseId,
    issue
  });

  res.status(201).json({
    success: true,
    message: "Support ticket created",
    token: ticket.token,
    ticket
  });
});
