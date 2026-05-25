import { Router } from "express";
import { markLectureWatched } from "../controllers/progress.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.patch("/:courseId/lectures/:lectureId", protect, requireRole("student"), markLectureWatched);

export default router;
