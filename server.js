import express from "express";
import dotenv from "dotenv";

import "./src/config/db.js";
import logger from './src/config/logger.js';


import paymentRoutes from "./src/routes/payment.route.js";
import billingRoutes from "./src/routes/billing.route.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Webhook route needs the raw request body for HMAC verification
app.use("/api/v1/payments/webhook",express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/v1/payments",paymentRoutes);
app.use("/api/v1/billing",billingRoutes);

app.use(errorMiddleware);

app.listen(3000,()=>{
    logger.info("Server running on port 3000");
});