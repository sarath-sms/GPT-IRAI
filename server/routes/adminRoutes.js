import express from "express";
import { assignOrdersByAdmin } from "../controllers/adminController.js";
import { toggleShopStatus } from "../controllers/shopController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { superAdminLogin } from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/login", superAdminLogin);
router.post("/assign-orders", protect, authorizeRoles("admin"), assignOrdersByAdmin);
router.patch("/shop/:id/toggle", protect, authorizeRoles("admin"), toggleShopStatus);

export default router;
