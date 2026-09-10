import logger from '../config/logger.js';

export function errorHandler(err, req, res, next) {
    logger.error(err.message);
    res.status(err.statusCode || 500).json({ message: err.statusCode ? err.message : 'Internal Server Error' });
}