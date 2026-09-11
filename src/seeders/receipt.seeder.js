import pool from "../config/db.js";

const seedReceiptSmsLogs = async () => {
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
        VALUES
        (
            '+916305063942',
            'Hello! Your Q_ORDER receipt is ready.',
            'REC-1001',
            'twilio',
            'SM-DUMMY-1001',
            'sent',
            CURRENT_TIMESTAMP,
            NULL
        ),
        (
            '+919876543210',
            'Thank you for ordering with Q_ORDER.',
            'REC-1002',
            'twilio',
            'SM-DUMMY-1002',
            'sent',
            CURRENT_TIMESTAMP,
            NULL
        ),
        (
            '+918888888888',
            'Your Q_ORDER receipt could not be delivered.',
            'REC-1003',
            'twilio',
            NULL,
            'failed',
            NULL,
            'Dummy SMS delivery failure'
        );
    `;

    await pool.query(query);

    console.log("Receipt SMS dummy data seeded successfully");

    await pool.end();
};

seedReceiptSmsLogs();

