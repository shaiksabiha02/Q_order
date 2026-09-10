import jwt from "jsonwebtoken";
import logger from "../config/logger.js";

export function socketAuthMiddleware(ws, request) {
    try {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        const token = url.searchParams.get("token");

        if (!token) {
            ws.close(1008, "Token required");
            return false;
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        ws.user = decoded;

        return true;

    } catch (error) {
        logger.error(
            `WebSocket authentication failed: ${error.message}`
        );

        ws.close(1008, "Invalid token");
        return false;
    }
}