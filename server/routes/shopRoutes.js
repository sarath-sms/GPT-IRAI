import express from "express";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  toggleShopStatus,
  linkDriversToShop,
  linkAdminsToShop,
} from "../controllers/shopController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧠 All routes require Super Admin (protected)
router.post("/create", protect, authorizeRoles("superAdmin"), createShop);
router.get("/", protect, authorizeRoles("superAdmin"), getAllShops);
router.get("/:id", protect, authorizeRoles("superAdmin"), getShopById);
router.patch("/:id", protect, authorizeRoles("superAdmin"), updateShop);
router.delete("/:id", protect, authorizeRoles("superAdmin"), deleteShop);
router.patch("/:id/toggle", protect, authorizeRoles("superAdmin", "admin"), toggleShopStatus);

router.post("/link-drivers", protect, authorizeRoles("superAdmin"), linkDriversToShop);
router.post("/link-admins", protect, authorizeRoles("superAdmin"), linkAdminsToShop);
export default router;
