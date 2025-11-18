// routes/feedbackRoutes.js

import express from "express";
import { submitFeedback, replyFeedback, getMyFeedback, getAllFeedback } from "../controllers/feedbackController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer
router.post("/", protect, submitFeedback);
router.get("/my", protect, getMyFeedback);

// Admin/SuperAdmin reply
router.get("/", protect, authorizeRoles("superAdmin", "admin"), getAllFeedback);
router.put("/:id/reply", protect, authorizeRoles("superAdmin", "admin"), replyFeedback);

export default router;
