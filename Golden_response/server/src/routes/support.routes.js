import { Router } from "express";
import { createTicket } from "../controllers/support.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/", protect, createTicket);

export default router;
