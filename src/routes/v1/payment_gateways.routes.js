import express from "express";

import paymentGatewaysController
    from "../../controllers/payment_gateways.controller.js";

import {
    validateCreatePaymentGateway,
    validatePaymentGatewayTenantId
} from "../../validators/payment_gateways.validator.js";

const router = express.Router();

router.post(
    "/tenants/:id/payment-gateway",
    validatePaymentGatewayTenantId,
    validateCreatePaymentGateway,
    paymentGatewaysController.createPaymentGateway
);

export default router;