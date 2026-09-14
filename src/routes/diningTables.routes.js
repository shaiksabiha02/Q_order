import express from "express";

import {
  getTables,
  clearTable,
} from "../controllers/diningTables.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  validateTableId,
} from "../validators/diningTables.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/staff/tables:
 *   get:
 *     tags:
 *       - Dining Tables
 *     summary: Get dining tables
 *     description: Retrieve the dining tables available for the authenticated staff member.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dining tables retrieved successfully
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  getTables
);

/**
 * @swagger
 * /api/v1/staff/tables/{id}/clear:
 *   post:
 *     tags:
 *       - Dining Tables
 *     summary: Clear dining table
 *     description: Clear the active order/cart associated with a specific dining table.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Dining table UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: c7956816-79c2-4891-bcf9-8c79721301e5
 *     responses:
 *       200:
 *         description: Table cleared successfully
 *       400:
 *         description: Invalid table ID
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Dining table not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:id/clear",
  authMiddleware,
  validateTableId,
  clearTable
);

export default router;