import express from "express";

import { createPaymentIntentController,
         paymentWebhookController,
         createCashRequestController
 } from "../controllers/payment.controller.js";

 import authMiddleware from "../middlewares/auth.middleware.js";
 
 const router = express.Router();

 
 /**
 * @swagger
 * /api/v1/payments/create-intent:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create payment intent
 *     description: Initiates a Razorpay payment session and creates a pending payment ledger record.
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *               - currency
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: 11e0b5f7-49bc-4259-b0f2-6b65f68342c2
 *               amount:
 *                 type: number
 *                 example: 840
 *               currency:
 *                 type: string
 *                 example: INR
 *               split_details:
 *                 nullable: true
 *                 example: null
 *     responses:
 *       201:
 *         description: Payment intent created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Payment gateway error
 */
 router.post("/create-intent",authMiddleware,createPaymentIntentController);




/**
 * @swagger
 * /api/v1/payments/webhook:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Process payment webhook
 *     description: Receives Razorpay webhook callbacks, verifies the HMAC signature, and processes payment.captured events.
 *     parameters:
 *       - in: header
 *         name: x-razorpay-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: Razorpay webhook HMAC signature
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               event: payment.captured
 *               payload:
 *                 payment:
 *                   entity:
 *                     id: pay_test123
 *                     order_id: order_TZuF2D2Cg1XDCq
 *     responses:
 *       200:
 *         description: Payment webhook processed successfully
 *       400:
 *         description: Invalid webhook signature or invalid payload
 *       404:
 *         description: Payment ledger record not found
 */
 router.post("/webhook",paymentWebhookController);



 /**
 * @swagger
 * /api/v1/payments/cash-request:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create cash payment request
 *     description: Creates a cash collection request for Staff or POS.
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - order_id
 *               - amount
 *             properties:
 *               order_id:
 *                 type: string
 *                 example: 11e0b5f7-49bc-4259-b0f2-6b65f68342c2
 *               amount:
 *                 type: number
 *                 example: 840
 *     responses:
 *       201:
 *         description: Cash payment request created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
 router.post("/cash-request",authMiddleware,createCashRequestController);
 export default router;