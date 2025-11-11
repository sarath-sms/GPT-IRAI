import express from "express";
import {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  toggleShopStatus,
} from "../controllers/shopController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🧠 All routes require Super Admin (protected)
router.post("/create", protect, createShop);
router.get("/", protect, getAllShops);
router.get("/:id", protect, getShopById);
router.patch("/:id", protect, updateShop);
router.delete("/:id", protect, deleteShop);
router.patch("/:id/toggle", protect, toggleShopStatus);

export default router;
