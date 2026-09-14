
import express from "express";

import { getOrders } from "../controllers/kdsgetorder.controller.js";
import { updateItemStatus } from "../controllers/kdsupdatestatus.controller.js";
import { syncKds } from "../controllers/kdssync.controller.js";
import { printKot } from "../controllers/kdsprintkot.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: KDS
 *   description: Kitchen Display System APIs
 */

/**
 * @swagger
 * /api/v1/kds/orders:
 *   get:
 *     summary: Get orders for KDS
 *     description: Retrieves orders that are relevant to the Kitchen Display System.
 *     tags: [KDS]
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
 *         description: Orders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/orders", getOrders);

/**
 * @swagger
 * /api/v1/kds/items/{item_id}/status:
 *   patch:
 *     summary: Update KDS item status
 *     description: Updates the preparation/status state of an order item in the Kitchen Display System.
 *     tags: [KDS]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order item ID
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
 *                 description: New status of the order item
 *                 example: preparing
 *     responses:
 *       200:
 *         description: Item status updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order item not found
 *       500:
 *         description: Internal server error
 */
router.patch("/items/:item_id/status", updateItemStatus);

/**
 * @swagger
 * /api/v1/kds/sync:
 *   get:
 *     summary: Synchronize KDS
 *     description: Retrieves the latest data required to synchronize the Kitchen Display System.
 *     tags: [KDS]
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
 *         description: KDS synchronized successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get("/sync", syncKds);

/**
 * @swagger
 * /api/v1/kds/print-kot:
 *   post:
 *     summary: Print KOT
 *     description: Sends a Kitchen Order Ticket (KOT) for printing.
 *     tags: [KDS]
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             order_id: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: KOT sent for printing successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/print-kot", printKot);

export default router;

