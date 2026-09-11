import express from "express";

import {
    createAssistance,
    getAssistance,
    resolveAssistance
} from "../controllers/assistance.controller.js";

import validateAssistance, {
    validateGetAssistance,
    validateAssistanceId,
    validateResolveAssistance
} from "../validators/assistance.validator.js";

const router = express.Router();

router.post(
    "/assistance/request",
    validateAssistance,
    createAssistance
);

router.get(
    "/staff/assistance-requests",
    validateGetAssistance,
    getAssistance
);

router.patch(
    "/staff/assistance-requests/:id",
    validateAssistanceId,
    validateResolveAssistance,
    resolveAssistance
);

export default router;