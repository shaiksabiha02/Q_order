import express from "express";

import {
    getTables,
    clearTable,
} from "../controllers/diningTables.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
    validateTableId,
} from "../validators/diningTables.validator.js";

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    getTables
);

router.post(
    "/:id/clear",
    authMiddleware,
    validateTableId,
    clearTable
);

export default router;