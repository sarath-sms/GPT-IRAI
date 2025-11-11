import express from "express";
import {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  assignOrderToDriver,
} from "../controllers/driverController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// SuperAdmin Only
router.post("/", protect, authorizeRoles("superAdmin"), createDriver);
router.get("/", protect, authorizeRoles("superAdmin"), getDrivers);
router.patch("/:id", protect, authorizeRoles("superAdmin"), updateDriver);
router.delete("/:id", protect, authorizeRoles("superAdmin"), deleteDriver);
router.post("/assign-orders", protect, authorizeRoles("superAdmin"), assignOrderToDriver);

export default router;
