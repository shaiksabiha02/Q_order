import express from "express";

import tenantsController from "../controllers/tenants.controller.js";

import {
    validateCreateTenant,
    validateTenantId,
    validateTenantStatus
} from "../validators/tenants.validator.js";

const router = express.Router();

router.post(
    "/",
    validateCreateTenant,
    tenantsController.createTenant
);

router.get(
    "/",
    tenantsController.getAllTenants
);

router.patch(
    "/:id/status",
    validateTenantId,
    validateTenantStatus,
    tenantsController.updateTenantStatus
);

export default router;