import logger from "../config/logger.js";

import {
    createRequest,
    getActiveRequests,
    resolveRequest
} from "../services/assistance.service.js";

export const createAssistance = async (req, res) => {
    const result = await createRequest(req.body);

    logger.info("Assistance request created", {
        assistance_id: result.id
    });

    res.status(201).json(result);
};

export const getAssistance = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const result = await getActiveRequests(
        Number(page),
        Number(limit)
    );

    res.status(200).json(result);
};

export const resolveAssistance = async (req, res) => {
    const { status } = req.body || {};

    const result = await resolveRequest(
        req.params.id,
        status
    );

    res.status(200).json({
        id: result.id,
        status: result.status
    });
};