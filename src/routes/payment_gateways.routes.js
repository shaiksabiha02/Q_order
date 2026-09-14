import express from "express";

import paymentGatewaysController from "../controllers/payment_gateways.controller.js";

import {
  validateCreatePaymentGateway,
  validatePaymentGatewayTenantId,
} from "../validators/payment_gateways.validator.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payment Gateways
 *   description: Payment gateway configuration APIs
 */

/**
 * @swagger
 * /api/v1/superadmin/tenants/{id}/payment-gateway:
 *   post:
 *     summary: Create payment gateway
 *     description: Creates and configures a payment gateway for a specific tenant.
 *     tags: [Payment Gateways]
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
 *               - gateway_name
 *               - api_key
 *             properties:
 *               gateway_name:
 *                 type: string
 *                 description: Name of the payment gateway
 *                 example: razorpay
 *               api_key:
 *                 type: string
 *                 description: Payment gateway API key
 *                 example: "rzp_test_xxxxxxxxxxxxx"
 *               secret_key:
 *                 type: string
 *                 description: Payment gateway secret key
 *                 example: "xxxxxxxxxxxxxxxx"
 *               is_active:
 *                 type: boolean
 *                 description: Whether the payment gateway is active
 *                 example: true
 *     responses:
 *       201:
 *         description: Payment gateway created successfully
 *       400:
 *         description: Invalid tenant ID or payment gateway data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tenant not found
 *       409:
 *         description: Payment gateway already exists for the tenant
 *       500:
 *         description: Internal server error
 */
router.post(
  "/tenants/:id/payment-gateway",
  validatePaymentGatewayTenantId,
  validateCreatePaymentGateway,
  paymentGatewaysController.createPaymentGateway
);

export default router;

