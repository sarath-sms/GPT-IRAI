import express from "express";
import { checkMobNo, checkOtp } from "../controllers/iraiController.js";
import { placeOrder } from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { getProducts } from "../controllers/productController.js";

const router = express.Router();

// 🔹 OTP-based auth (no token)
router.post("/entry", checkMobNo);
router.post("/verify", checkOtp);


// 🔹 Orders (protected)
router.post("/order", protect, authorizeRoles("user"), placeOrder);

export default router;
