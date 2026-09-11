
import { submitFeedback } from "../services/feedback.service.js";
import logger from "../config/logger.js";

export const createFeedback = async (req, res) => {
    const result = await submitFeedback(req.body);

    logger.info("Feedback created successfully", {
        feedbackId: result?.id,
        orderId: req.body.order_id
    });

    return res.status(201).json(result);
};

