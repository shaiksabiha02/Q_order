import pool from "../config/db.js";

const query = `
CREATE TABLE IF NOT EXISTS receipt_sms_logs (
    id BIGSERIAL PRIMARY KEY,

    phone_number VARCHAR(20) NOT NULL,

    message TEXT NOT NULL,

    receipt_reference VARCHAR(100),

    provider VARCHAR(50) NOT NULL DEFAULT 'twilio',

    provider_message_id VARCHAR(150),

    status VARCHAR(30) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending', 'sent', 'failed')),

    error_message TEXT,

    sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_receipt_sms_phone
    ON receipt_sms_logs(phone_number);

CREATE INDEX IF NOT EXISTS idx_receipt_sms_status
    ON receipt_sms_logs(status);

CREATE INDEX IF NOT EXISTS idx_receipt_sms_created_at
    ON receipt_sms_logs(created_at DESC);
`;

const runMigration = async () => {
    try {
        await pool.query(query);

        console.log("Receipt SMS logs table created successfully");
    } catch (error) {
        console.error("Failed to create receipt SMS logs table:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

runMigration();