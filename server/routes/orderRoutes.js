import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// User places an order
router.post("/place", protect, authorizeRoles("user"), placeOrder);

export default router;
