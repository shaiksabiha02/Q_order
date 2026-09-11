import express from "express";
import { sendReceiptSms } from "../controllers/receipt.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post(
    "/send-sms",
    authMiddleware,
    sendReceiptSms
);

export default router;

