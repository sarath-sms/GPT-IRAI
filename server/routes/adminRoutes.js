import express from "express";
import { toggleShopStatus } from "../controllers/shopController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { employeeLogin } from "../controllers/authController.js";
import { getAdminOrders } from "../controllers/adminOrderController.js";
import { getMyShops } from "../controllers/adminController.js";
import { assignOrdersToDriver, getAvailableDrivers } from "../controllers/orderAssignController.js";

const router = express.Router();

router.post("/login", employeeLogin);
router.patch("/shop/:id/toggle", protect, authorizeRoles("admin"), toggleShopStatus);

router.get("/my-shops", protect, authorizeRoles("admin"), getMyShops);
router.get(
  "/orders",
  protect,
  authorizeRoles("admin"),
  getAdminOrders
);
router.get("/available-drivers", protect, authorizeRoles("admin"), getAvailableDrivers);
router.post("/assign-orders", protect, authorizeRoles("admin"), assignOrdersToDriver);
// router.get("/api/admin/available-drivers", protect, authorizeRoles("admin"), getAvailableDrivers);
export default router;
