import { Router } from "express";
import { getProfile } from "../controllers/profile.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/me", protect, getProfile);

export default router;
