import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (superAdmin only)
router.post("/", protect, createProduct);
router.get("/", getProducts);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect, deleteProduct);

export default router;
