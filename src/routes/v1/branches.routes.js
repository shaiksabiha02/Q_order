import express from "express";

import branchesController from "../../controllers/branches.controller.js";

import {
    validateCreateBranch,
    validateBranchTenantId
} from "../../validators/branches.validator.js";

const router = express.Router();

router.post(
    "/tenants/:id/branches",
    validateBranchTenantId,
    validateCreateBranch,
    branchesController.createBranch
);

export default router;