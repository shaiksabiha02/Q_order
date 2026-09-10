import logger from '../config/logger.js';

export const errorMiddleware = (err, req, res, next) => {
    logger.error("Application Error", {
        error: err.message,
        method: req.method,
        url: req.originalUrl
    });

    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};