import express from "express";

import {
  getRestaurantProfile,
} from "../controllers/restaurant.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Restaurant
 *   description: Restaurant profile management APIs
 */

/**
 * @swagger
 * /api/v1/restaurant/profile:
 *   get:
 *     summary: Get restaurant profile
 *     description: Retrieves the profile details of the restaurant associated with the authenticated user, tenant, and branch.
 *     tags: [Restaurant]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: X-Tenant-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *       - in: header
 *         name: X-Branch-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: Branch ID
 *     responses:
 *       200:
 *         description: Restaurant profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Restaurant profile retrieved successfully
 *                 data:
 *                   type: object
 *                   description: Restaurant profile details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Restaurant profile not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/profile",
  authMiddleware,
  getRestaurantProfile
);

export default router;

