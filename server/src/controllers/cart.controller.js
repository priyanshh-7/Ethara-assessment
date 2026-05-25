import Cart from "../models/Cart.js";
import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getOrCreateCart = async (student) => {
  let cart = await Cart.findOne({ student });
  if (!cart) cart = await Cart.create({ student, courses: [] });
  return cart;
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  await cart.populate({ path: "courses", populate: { path: "educator", select: "name phone" } });
  const total = cart.courses.reduce((sum, course) => sum + course.price, 0);
  res.json({ success: true, cart, total });
});

export const addToCart = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  const enrolled = await Enrollment.findOne({ student: req.user._id, course: course._id });
  if (enrolled) {
    res.status(409);
    throw new Error("You are already enrolled in this course");
  }

  const cart = await getOrCreateCart(req.user._id);
  if (!cart.courses.some((id) => String(id) === String(course._id))) {
    cart.courses.push(course._id);
    await cart.save();
  }

  await cart.populate("courses");
  res.json({ success: true, message: "Course added to cart", cart });
});

export const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.courses = cart.courses.filter((id) => String(id) !== req.params.courseId);
  await cart.save();
  await cart.populate("courses");
  res.json({ success: true, message: "Course removed from cart", cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user._id);
  cart.courses = [];
  await cart.save();
  res.json({ success: true, message: "Cart cleared", cart });
});
