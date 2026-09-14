import express from "express";

import authController from "../controllers/adminAuth.controller.js";

import {
  validateLogin
} from "../validators/adminAuth.validator.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/superadmin/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Super Admin Login
 *     description: Authenticate a super admin and return a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Admin@123
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */
router.post(
  "/login",
  validateLogin,
  authController.login
);

export default router;