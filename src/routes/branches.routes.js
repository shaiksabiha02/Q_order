import express from "express";

import branchesController from "../controllers/branches.controller.js";

import {
  validateCreateBranch,
  validateBranchTenantId
} from "../validators/branches.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/superadmin/tenants/{id}/branches:
 *   post:
 *     tags:
 *       - Branches
 *     summary: Create a branch
 *     description: Create a new branch for a specific tenant.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Tenant UUID
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Branch details
 *             properties:
 *               name:
 *                 type: string
 *                 example: Main Branch
 *               address:
 *                 type: string
 *                 example: Hyderabad
 *               phone:
 *                 type: string
 *                 example: "+919876543210"
 *     responses:
 *       201:
 *         description: Branch created successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       404:
 *         description: Tenant not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/tenants/:id/branches",
  validateBranchTenantId,
  validateCreateBranch,
  branchesController.createBranch
);

export default router;