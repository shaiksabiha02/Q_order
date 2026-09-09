import express from "express";
import {
  getBillingSummaryController,
  splitBillController,
} from "../controllers/billing.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/billing/summary:
 *   get:
 *     summary: Get billing summary
 *     description: Fetch aggregated billing details including subtotal, tax, service charge, discount, total, paid amount, and balance.
 *     parameters:
 *       - in: header
 *         name: x-tenant-id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tenant ID
 *       - in: query
 *         name: order_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Billing summary fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.get("/summary", getBillingSummaryController);


/**
 * @swagger
 * /api/v1/billing/split:
 *   post:
 *     summary: Split bill
 *     description: Calculate bill split using EQUAL or BY_ITEM split type.
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
 *               - orderId
 *               - splitType
 *               - parts
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: e51b3f12-e9a9-495d-966a-195b255b81fb
 *               splitType:
 *                 type: string
 *                 enum:
 *                   - EQUAL
 *                   - BY_ITEM
 *                 example: EQUAL
 *               parts:
 *                 type: integer
 *                 example: 2
 *               items:
 *                 type: array
 *                 description: Required when splitType is BY_ITEM
 *                 items:
 *                   type: object
 *                   properties:
 *                     order_item_id:
 *                       type: string
 *                     assigned_parts:
 *                       type: array
 *                       items:
 *                         type: integer
 *     responses:
 *       200:
 *         description: Bill split calculated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Order not found
 */
router.post("/split", splitBillController);

export default router;