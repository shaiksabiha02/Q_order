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

router.post(
    "/staff/login",
    loginStaff
);

router.post(
    "/refresh",
    refreshToken
);

router.post(
    "/logout",
    logout
);

router.post(
    "/qr-handshake",
    handleQrHandshake
);

export default router;