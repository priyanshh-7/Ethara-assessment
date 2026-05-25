import Course from "../models/Course.js";
import Enrollment from "../models/Enrollment.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getProfile = asyncHandler(async (req, res) => {
  if (req.user.role === "educator") {
    const courses = await Course.find({ educator: req.user._id }).sort({ createdAt: -1 });
    const courseIds = courses.map((course) => course._id);
    const enrollmentStats = await Enrollment.aggregate([
      { $match: { course: { $in: courseIds } } },
      { $group: { _id: "$course", students: { $sum: 1 }, earnings: { $sum: "$amountPaid" } } }
    ]);
    const stats = Object.fromEntries(enrollmentStats.map((item) => [String(item._id), item]));
    const totalEarnings = enrollmentStats.reduce((sum, item) => sum + item.earnings, 0);

    return res.json({
      success: true,
      role: "educator",
      user: req.user,
      totalEarnings,
      courses: courses.map((course) => ({
        ...course.toObject(),
        enrolledStudents: stats[String(course._id)]?.students || 0,
        earnings: stats[String(course._id)]?.earnings || 0
      }))
    });
  }

  const enrollments = await Enrollment.find({ student: req.user._id })
    .populate({ path: "course", populate: { path: "educator", select: "name phone" } })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    role: "student",
    user: req.user,
    enrollments: enrollments.map((enrollment) => {
      const totalLectures = enrollment.course.lectures.length;
      const watched = enrollment.watchedLectures.length;
      return {
        ...enrollment.toObject(),
        progress: totalLectures ? Math.round((watched / totalLectures) * 100) : 0,
        watched,
        totalLectures
      };
    })
  });
});
