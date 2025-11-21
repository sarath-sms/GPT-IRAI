import express from "express";
// import { driverLogin } from "../controllers/driverAuthController.js";
import { getAssignedOrders, driverUpdateOrderStatus } from "../controllers/driverOrderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { employeeLogin } from "../controllers/authController.js";

const router = express.Router();

// 🔹 Driver login (public)
router.post("/login", employeeLogin);

// 🔹 Assigned orders (protected)
router.get("/orders", protect, authorizeRoles("driver"), getAssignedOrders);
router.patch("/orders/:id/status", protect, authorizeRoles("driver"), driverUpdateOrderStatus);

export default router;
