import express from "express";
import {
  createSuperAdmin,
  superAdminLogin,
} from "../controllers/superAdminController.js";
import {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
  assignOrderToDriver,
} from "../controllers/driverController.js";
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
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
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { createAdmin, deleteAdmin, getAdmins, updateAdmin } from "../controllers/adminController.js";

const router = express.Router();

// 🔹 SuperAdmin Auth
router.post("/create", createSuperAdmin);
router.post("/login", superAdminLogin);

// 🔹 Admin Management
router.post("/admins", protect, authorizeRoles("superAdmin"), createAdmin);
router.get("/admins", protect, authorizeRoles("superAdmin"), getAdmins);
router.patch("/admins/:id", protect, authorizeRoles("superAdmin"), updateAdmin);
router.delete("/admins/:id", protect, authorizeRoles("superAdmin"), deleteAdmin);

// 🔹 Driver Management
router.post("/drivers", protect, authorizeRoles("superAdmin"), createDriver);
router.get("/drivers", protect, authorizeRoles("superAdmin"), getDrivers);
router.patch("/drivers/:id", protect, authorizeRoles("superAdmin"), updateDriver);
router.delete("/drivers/:id", protect, authorizeRoles("superAdmin"), deleteDriver);
router.post("/drivers/assign-orders", protect, authorizeRoles("superAdmin"), assignOrderToDriver);

// 🔹 Product Management
router.post("/products", protect, authorizeRoles("superAdmin"), createProduct);
router.get("/products", getProducts);
router.put("/products/:id", protect, authorizeRoles("superAdmin"), updateProduct);
router.delete("/products/:id", protect, authorizeRoles("superAdmin"), deleteProduct);

// 🔹 Shop Management
router.post("/shops", protect, authorizeRoles("superAdmin"), createShop);
router.get("/shops", protect, authorizeRoles("superAdmin"), getAllShops);
router.get("/shops/:id", protect, authorizeRoles("superAdmin"), getShopById);
router.patch("/shops/:id", protect, authorizeRoles("superAdmin"), updateShop);
router.delete("/shops/:id", protect, authorizeRoles("superAdmin"), deleteShop);
router.patch("/shops/:id/toggle", protect, authorizeRoles("superAdmin"), toggleShopStatus);

// 🔹 Linking
router.post("/shops/link-drivers", protect, authorizeRoles("superAdmin"), linkDriversToShop);
router.post("/shops/link-admins", protect, authorizeRoles("superAdmin"), linkAdminsToShop);

export default router;
