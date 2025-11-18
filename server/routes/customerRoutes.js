import express from "express";
import { checkMobNo, checkOtp, getProfile, updateProfile } from "../controllers/customerController.js";
import { placeOrder } from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 OTP-based auth (no token)
router.post("/entry", checkMobNo);
router.post("/verify", checkOtp);

router.get("/profile", protect, authorizeRoles("customer"), getProfile);
router.put("/profile", protect, authorizeRoles("customer"), updateProfile);
// 🔹 Orders (protected)
router.post("/order", protect, authorizeRoles("customer"), placeOrder);

export default router;
