import express from "express";
import { toggleShopStatus } from "../controllers/shopController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { employeeLogin } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", employeeLogin);
router.patch("/shop/:id/toggle", protect, authorizeRoles("admin"), toggleShopStatus);

export default router;
