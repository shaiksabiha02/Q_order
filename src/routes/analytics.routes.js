import express from "express";

import analyticsController from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/superadmin/analytics/gmv:
 *   get:
 *     tags:
 *       - Analytics
 *     summary: Get GMV analytics
 *     description: Retrieve Gross Merchandise Value (GMV) analytics for the business.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: GMV analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   description: GMV analytics data
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get(
  "/analytics/gmv",
  analyticsController.getGMV
);

export default router;