import { Router } from "express";
import { addToCart, clearCart, getCart, removeFromCart } from "../controllers/cart.controller.js";
import { protect, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protect, requireRole("student"));
router.get("/", getCart);
router.post("/:courseId", addToCart);
router.delete("/:courseId", removeFromCart);
router.delete("/", clearCart);

export default router;
