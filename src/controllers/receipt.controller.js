import { sendReceipt } from "../services/receipt.service.js";
import logger from "../config/logger.js";

export const sendReceiptSms = async (req, res) => {
    const {
        phone_number,
        message,
        receipt_reference
    } = req.body;

    const result = await sendReceipt({
        phoneNumber: phone_number,
        message,
        receiptReference: receipt_reference
    });

    logger.info("Receipt SMS sent successfully", {
        receiptReference: receipt_reference
    });

    return res.status(200).json({
        success: true,
        message: "Receipt SMS sent successfully",
        data: result
    });
};

