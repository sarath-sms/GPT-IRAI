import express from "express";
import {
  createSuperAdmin,
} from "../controllers/superAdminController.js";
import {
  createDriver,
  getDrivers,
  updateDriver,
  deleteDriver,
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
import { getSuperAdminDashboard } from "../controllers/superAdminDashboardController.js";
import { employeeLogin } from "../controllers/authController.js";

const router = express.Router();

// 🔹 SuperAdmin Auth
router.post("/create", createSuperAdmin);
router.post("/login", employeeLogin);

// ADMIN CRUD
router.post("/admins", protect, authorizeRoles("superadmin"), createAdmin);
router.get("/admins", protect, authorizeRoles("superadmin"), getAdmins);
router.patch("/admins/:id", protect, authorizeRoles("superadmin"), updateAdmin);
router.delete("/admins/:id", protect, authorizeRoles("superadmin"), deleteAdmin);

// DRIVER CRUD
router.post("/drivers", protect, authorizeRoles("superadmin"), createDriver);
router.get("/drivers", protect, authorizeRoles("superadmin"), getDrivers);
router.patch("/drivers/:id", protect, authorizeRoles("superadmin"), updateDriver);
router.delete("/drivers/:id", protect, authorizeRoles("superadmin"), deleteDriver);

// 🔹 Product Management
router.post("/products", protect, authorizeRoles("superadmin"), createProduct);
router.get("/products", getProducts);
router.put("/products/:id", protect, authorizeRoles("superadmin"), updateProduct);
router.delete("/products/:id", protect, authorizeRoles("superadmin"), deleteProduct);

// 🔹 Shop Management
router.post("/shops", protect, authorizeRoles("superadmin"), createShop);
router.get("/shops", protect, authorizeRoles("superadmin"), getAllShops);
router.get("/shops/:id", protect, authorizeRoles("superadmin"), getShopById);
router.patch("/shops/:id", protect, authorizeRoles("superadmin"), updateShop);
router.delete("/shops/:id", protect, authorizeRoles("superadmin"), deleteShop);
router.patch("/shops/:id/toggle", protect, authorizeRoles("superadmin"), toggleShopStatus);

// 🔹 Linking
router.post("/shops/link-drivers", protect, authorizeRoles("superadmin"), linkDriversToShop);
router.post("/shops/link-admins", protect, authorizeRoles("superadmin"), linkAdminsToShop);


// our actions
router.get("/dashboard", protect, authorizeRoles("superadmin"), getSuperAdminDashboard);


export default router;
