import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const markLectureWatched = asyncHandler(async (req, res) => {
  const { courseId, lectureId } = req.params;
  const course = await Course.findById(courseId);
  if (!course || !course.lectures.id(lectureId)) {
    res.status(404);
    throw new Error("Course or lecture not found");
  }

  const enrollment = await Enrollment.findOne({ student: req.user._id, course: courseId });
  if (!enrollment) {
    res.status(403);
    throw new Error("You must enroll before watching this course");
  }

  if (!enrollment.watchedLectures.some((id) => String(id) === lectureId)) {
    enrollment.watchedLectures.push(lectureId);
    await enrollment.save();
  }

  const progress = course.lectures.length
    ? Math.round((enrollment.watchedLectures.length / course.lectures.length) * 100)
    : 0;

  res.json({ success: true, message: "Progress updated", progress, enrollment });
});
