import pool from "../config/db.js";

export const createReceiptSmsLog = async ({
    phoneNumber,
    message,
    receiptReference,
    provider,
    providerMessageId,
    status,
    sentAt,
    errorMessage
}) => {
    const query = `
        INSERT INTO receipt_sms_logs (
            phone_number,
            message,
            receipt_reference,
            provider,
            provider_message_id,
            status,
            sent_at,
            error_message
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
    `;

    const values = [
        phoneNumber,
        message,
        receiptReference,
        provider,
        providerMessageId,
        status,
        sentAt,
        errorMessage
    ];

    const result = await pool.query(query, values);

    return result.rows[0];
};
