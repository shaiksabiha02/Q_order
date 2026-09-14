import express from "express";

import { createFeedback } from "../controllers/feedback.controller.js";
import { validateFeedback } from "../validators/feedback.validator.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/feedback:
 *   post:
 *     summary: Create feedback
 *     tags:
 *       - Feedback
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: integer
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: "Excellent service"
 *     responses:
 *       201:
 *         description: Feedback created successfully
 *       401:
 *         description: Authentication token is required
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post(
    "/",
    authMiddleware,
    validateFeedback,
    createFeedback
);

export default router;

