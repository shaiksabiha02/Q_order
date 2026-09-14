import express from "express";

import {
  loginStaff,
  refreshToken,
  logout,
} from "../controllers/auth.controller.js";

import {
  handleQrHandshake,
} from "../controllers/qrHandshake.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/auth/staff/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Staff Login
 *     description: Authenticate a staff member and return authentication tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: staff@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Staff@123
 *     responses:
 *       200:
 *         description: Staff login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post(
  "/staff/login",
  loginStaff
);

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Refresh Access Token
 *     description: Generate a new access token using a refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: YOUR_REFRESH_TOKEN
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Invalid or expired refresh token
 *       500:
 *         description: Internal server error
 */
router.post(
  "/refresh",
  refreshToken
);

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Staff Logout
 *     description: Logout the authenticated staff member.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
router.post(
  "/logout",
  logout
);

/**
 * @swagger
 * /api/v1/auth/qr-handshake:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: QR Handshake
 *     description: Handle the QR code handshake for guest authentication and session initialization.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties: true
 *     responses:
 *       200:
 *         description: QR handshake completed successfully
 *       400:
 *         description: Invalid QR handshake request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post(
  "/qr-handshake",
  handleQrHandshake
);

export default router;