import { Router } from "express";
import { createOrder, verifyPayment } from "../controllers/payment.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, requireRole("student"));
router.post("/order", createOrder);
router.post("/verify", verifyPayment);

export default router;
