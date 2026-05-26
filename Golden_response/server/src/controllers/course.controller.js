import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cleanObject } from "../utils/sanitize.js";

export const listCourses = asyncHandler(async (req, res) => {
  const filter = { isPublished: true };
  if (req.query.domain) filter.domain = req.query.domain;

  const courses = await Course.find(filter)
    .populate("educator", "name email phone")
    .sort({ createdAt: -1 });

  res.json({ success: true, courses });
});

export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("educator", "name email phone");
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.json({ success: true, course });
});

export const createCourse = asyncHandler(async (req, res) => {
  const body = cleanObject(req.body);
  const { title, domain, description, price, educatorContact, thumbnail } = body;

  if (!title || !domain || !description || price === undefined || !educatorContact) {
    res.status(400);
    throw new Error("Title, domain, description, price and educator contact are required");
  }

  const course = await Course.create({
    title,
    domain,
    description,
    thumbnail,
    price: Number(price),
    educatorContact,
    educator: req.user._id,
    lectures: []
  });

  res.status(201).json({ success: true, message: "Course created", course });
});

export const updateCourse = asyncHandler(async (req, res) => {
  const updates = cleanObject(req.body);
  const course = await Course.findOne({ _id: req.params.id, educator: req.user._id });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  ["title", "domain", "description", "thumbnail", "educatorContact"].forEach((field) => {
    if (updates[field] !== undefined) course[field] = updates[field];
  });
  if (updates.price !== undefined) course.price = Number(updates.price);

  await course.save();
  res.json({ success: true, message: "Course updated", course });
});

export const addLecture = asyncHandler(async (req, res) => {
  const body = cleanObject(req.body);
  const { title, description, videoUrl, durationMinutes } = body;

  if (!title || !videoUrl) {
    res.status(400);
    throw new Error("Lecture title and video URL are required");
  }

  const course = await Course.findOne({ _id: req.params.id, educator: req.user._id });
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  course.lectures.push({
    title,
    description,
    videoUrl,
    durationMinutes: Number(durationMinutes || 0)
  });
  await course.save();

  res.status(201).json({ success: true, message: "Lecture added", course });
});

export const educatorCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ educator: req.user._id }).sort({ createdAt: -1 });
  const courseIds = courses.map((course) => course._id);
  const enrollments = await Enrollment.aggregate([
    { $match: { course: { $in: courseIds } } },
    { $group: { _id: "$course", students: { $sum: 1 }, earnings: { $sum: "$amountPaid" } } }
  ]);

  const stats = Object.fromEntries(enrollments.map((item) => [String(item._id), item]));
  const payload = courses.map((course) => ({
    ...course.toObject(),
    enrolledStudents: stats[String(course._id)]?.students || 0,
    earnings: stats[String(course._id)]?.earnings || 0
  }));

  res.json({ success: true, courses: payload });
});
