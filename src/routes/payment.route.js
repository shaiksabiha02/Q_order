import express from "express";

import { createPaymentIntentController,
         paymentWebhookController,
         createCashRequestController
 } from "../controllers/payment.controller.js";
 const router = express.Router();
 

 router.post("/create-intent",createPaymentIntentController);
 router.post("/webhook",paymentWebhookController);
 router.post("/cash-request",createCashRequestController);
 export default router;