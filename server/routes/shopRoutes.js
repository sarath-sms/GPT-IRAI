import express from "express";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  toggleShopStatus,
} from "../controllers/shopController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧠 All routes require Super Admin (protected)
router.post("/create", protect, authorizeRoles("superadmin"), createShop);
router.get("/", protect, authorizeRoles("superadmin, admin, driver"), getAllShops);
router.get("/:id", protect, authorizeRoles("superadmin"), getShopById);
router.patch("/:id", protect, authorizeRoles("superadmin"), updateShop);
router.delete("/:id", protect, authorizeRoles("superadmin"), deleteShop);
router.patch("/:id/toggle", protect, authorizeRoles("superadmin", "admin"), toggleShopStatus);


export default router;
