import express from "express";
import { checkMobNo, checkOtp } from "../controllers/iraiController.js";

const router = express.Router();

router.post("/entry", checkMobNo);
router.post("/verify", checkOtp);

export default router;
