import express from "express";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { authorizeRoles, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected routes (superAdmin only)
router.post("/", protect, authorizeRoles("superAdmin"), createProduct);
router.get("/", getProducts);
router.put("/:id", protect, authorizeRoles("superAdmin"), updateProduct);
router.delete("/:id", protect, authorizeRoles("superAdmin"), deleteProduct);

export default router;
