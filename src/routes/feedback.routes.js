import express from "express";

import { createFeedback } from "../controllers/feedback.controller.js";
import { validateFeedback } from "../validators/feedback.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validateFeedback,
    createFeedback
);

export default router;