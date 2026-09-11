
import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error("Application error", {
        message: err.message,
        stack: err.stack,
        method: req.method,
        url: req.originalUrl
    });

    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

