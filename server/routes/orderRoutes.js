// routes/orderRoutes.js
import express from "express";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

// both ADMIN & DRIVER
router.patch(
  "/update-status",
  protect,
  authorizeRoles("admin", "driver"),
  updateOrderStatus
);

export default router;
