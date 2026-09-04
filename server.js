import express from "express";
import dotenv from "dotenv";

import "./src/config/db.js";
import "./src/config/razorpay.js";

import paymentRoutes from "./src/routes/payment.route.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Webhook route needs the raw request body for HMAC verification
app.use("/api/v1/payments/webhook",express.raw({ type: "application/json" }));

app.use(express.json());

app.use("/api/v1/payments",paymentRoutes);

app.use(errorMiddleware);

app.listen(3000,()=>{
    console.log("Server running on port 3000");
});