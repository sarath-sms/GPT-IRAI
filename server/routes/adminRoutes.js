import express from "express";
import { createSuperAdmin, superAdminLogin } from "../controllers/superAdminController.js";

const router = express.Router();

router.post("/create", (req, res) => {
  createSuperAdmin(req, res);
});

router.post("/login", superAdminLogin);

export default router;
