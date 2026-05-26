import crypto from "crypto";
import Cart from "../models/Cart.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import Payment from "../models/Payment.js";
import { razorpay } from "../config/razorpay.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createOrder = asyncHandler(async (req, res) => {
  if (!razorpay) {
    res.status(500);
    throw new Error("Razorpay is not configured");
  }

  const cart = await Cart.findOne({ student: req.user._id }).populate("courses");
  if (!cart || cart.courses.length === 0) {
    res.status(400);
    throw new Error("Cart is empty");
  }

  const amount = cart.courses.reduce((sum, course) => sum + course.price, 0);
  const order = await razorpay.orders.create({
    amount: Math.round(amount * 100),
    currency: "INR",
    receipt: `ethara_${Date.now()}`
  });

  const payment = await Payment.create({
    student: req.user._id,
    courses: cart.courses.map((course) => course._id),
    amount,
    razorpayOrderId: order.id
  });

  res.status(201).json({
    success: true,
    message: "Payment order created",
    order,
    paymentId: payment._id,
    key: process.env.RAZORPAY_KEY_ID
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expected !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed");
  }

  const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
  if (!payment) {
    res.status(404);
    throw new Error("Payment record not found");
  }

  payment.status = "paid";
  payment.razorpayPaymentId = razorpay_payment_id;
  await payment.save();

  const courses = await Course.find({ _id: { $in: payment.courses } });
  await Promise.all(
    courses.map((course) =>
      Enrollment.findOneAndUpdate(
        { student: req.user._id, course: course._id },
        { student: req.user._id, course: course._id, paymentId: razorpay_payment_id, amountPaid: course.price },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    )
  );

  await Cart.findOneAndUpdate({ student: req.user._id }, { courses: [] });

  res.json({ success: true, message: "Payment verified and enrollment completed" });
});
