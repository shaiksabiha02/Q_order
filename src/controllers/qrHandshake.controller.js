import { qrHandshake } from "../services/qrHandshake.service.js";

export const handleQrHandshake = async (req, res) => {
    const { qr_token } = req.body;

    const result = await qrHandshake(qr_token);

    return res.status(200).json({
        success: true,
        message: "QR handshake successful",
        data: result,
    });
};

