import { qrHandshake } from "../services/qrHandshake.service.js";

import logger from "../config/logger.js";

export const handleQrHandshake = async (req, res) => {
    try {
        const { qr_token } = req.body;

        const result = await qrHandshake(qr_token);

        return res.status(200).json({
            success: true,
            message: "QR handshake successful",
            data: result,
        });

    } catch (error) {
        logger.error("QR Handshake Error", {
            error: error.message,
        });

        if (error.message === "Invalid QR token") {
            return res.status(401).json({
                success: false,
                message: "Invalid QR token",
            });
        }

        if (
            error.message ===
            "Table is currently unavailable"
        ) {
            return res.status(409).json({
                success: false,
                message: "Table is currently unavailable",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};