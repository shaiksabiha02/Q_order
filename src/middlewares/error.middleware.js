import logger from "../config/logger.js";
const errorMiddleware = (err, req, res, next) => {
    
    logger.error("Error:",err);

    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success:false,
        message:err.message || "Internal server Error"
    });
};
export default errorMiddleware;