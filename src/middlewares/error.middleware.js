import logger from "../config/logger.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err.message, {
        stack: err.stack,
        method: req.method,
        path: req.originalUrl
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

