import { Router } from "express";

import { OrderController } from "../controllers/order.controller.js";

import {
  validateSubmitOrder,
  validateSessionHistory,
  validateOrderStatus,
} from "../validators/order.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management APIs
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Submit a new order
 *     description: Creates and submits a new customer order.
 *     tags: [Orders]
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
 *       - in: header
 *         name: X-Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique UUID v4 key used to prevent duplicate order submissions.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             session_id: "123e4567-e89b-12d3-a456-426614174000"
 *             items:
 *               - menu_item_id: "123e4567-e89b-12d3-a456-426614174001"
 *                 quantity: 2
 *     responses:
 *       201:
 *         description: Order submitted successfully
 *       400:
 *         description: Invalid order data
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate order request
 *       500:
 *         description: Internal server error
 */
router.post("/", validateSubmitOrder, OrderController.submitOrder);

/**
 * @swagger
 * /api/v1/orders/session-history:
 *   get:
 *     summary: Get session order history
 *     description: Retrieves the order history associated with the current customer session.
 *     tags: [Orders]
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
 *         description: Session order history retrieved successfully
 *       400:
 *         description: Invalid session information
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/session-history",
  validateSessionHistory,
  OrderController.getSessionHistory
);

/**
 * @swagger
 * /api/v1/orders/{order_id}/status:
 *   get:
 *     summary: Get order status
 *     description: Retrieves the current status of a specific order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
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
 *         description: Order status retrieved successfully
 *       400:
 *         description: Invalid order ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:order_id/status",
  validateOrderStatus,
  OrderController.getOrderStatus
);

/**
 * @swagger
 * /api/v1/orders/{order_id}/status:
 *   patch:
 *     summary: Update order status
 *     description: Updates the status of a specific order.
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
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
 *                 description: New order status
 *                 example: preparing
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       400:
 *         description: Invalid order status
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:order_id/status",
  validateOrderStatus,
  OrderController.updateOrderStatus
);

export default router;

