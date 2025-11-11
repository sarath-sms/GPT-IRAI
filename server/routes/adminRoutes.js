import express from "express";
import { createSuperAdmin, superAdminLogin } from "../controllers/superAdminController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";
import { assignOrdersByAdmin } from "../controllers/adminController.js";

const router = express.Router();

// super admin
router.post("/create", createSuperAdmin);
router.post("/login", superAdminLogin);

// admin
router.post("/assign-orders", protect, authorizeRoles("admin"), assignOrdersByAdmin);

export default router;
