import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
    logger.error({
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack
    });

    return res.status(500).json({
        message: "Internal server error"
    });
};

export default errorMiddleware;