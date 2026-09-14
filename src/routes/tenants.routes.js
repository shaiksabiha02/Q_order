import express from "express";

import tenantsController from "../controllers/tenants.controller.js";

import {
  validateCreateTenant,
  validateTenantId,
  validateTenantStatus,
} from "../validators/tenants.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management APIs
 */

/**
 * @swagger
 * /api/v1/tenants:
 *   post:
 *     summary: Create a new tenant
 *     description: Creates a new tenant account in the system.
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             name: "ABC Restaurant"
 *             email: "admin@abcrestaurant.com"
 *             phone: "9876543210"
 *     responses:
 *       201:
 *         description: Tenant created successfully
 *       400:
 *         description: Invalid tenant data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Tenant already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  validateCreateTenant,
  tenantsController.createTenant
);

/**
 * @swagger
 * /api/v1/tenants:
 *   get:
 *     summary: Get all tenants
 *     description: Retrieves a list of all tenants.
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tenants retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  tenantsController.getAllTenants
);

/**
 * @swagger
 * /api/v1/tenants/{id}/status:
 *   patch:
 *     summary: Update tenant status
 *     description: Updates the active or inactive status of a tenant.
 *     tags: [Tenants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum:
 *                   - active
 *                   - inactive
 *                 example: active
 *     responses:
 *       200:
 *         description: Tenant status updated successfully
 *       400:
 *         description: Invalid tenant ID or status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id/status",
  validateTenantId,
  validateTenantStatus,
  tenantsController.updateTenantStatus
);

export default router;

