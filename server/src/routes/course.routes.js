import { Router } from "express";
import {
  addLecture,
  createCourse,
  educatorCourses,
  getCourse,
  listCourses,
  updateCourse
} from "../controllers/course.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", listCourses);
router.get("/educator/mine", protect, requireRole("educator"), educatorCourses);
router.get("/:id", getCourse);
router.post("/", protect, requireRole("educator"), createCourse);
router.patch("/:id", protect, requireRole("educator"), updateCourse);
router.post("/:id/lectures", protect, requireRole("educator"), addLecture);

export default router;
