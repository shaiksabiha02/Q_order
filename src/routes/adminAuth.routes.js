import express from "express";

import authController from "../controllers/adminAuth.controller.js";

import {
    validateLogin
} from "../validators/adminAuth.validator.js";

const router = express.Router();

router.post(
    "/login",
    validateLogin,
    authController.login
);

export default router;