import pool from "../config/db.js";
import logger from "../config/logger.js";

const seedAssistance = async () => {
    try {
        const result = await pool.query(`
            SELECT
                guest_id,
                tenant_id,
                branch_id,
                table_id
            FROM guest_sessions
            ORDER BY created_at DESC
            LIMIT 1;
        `);

        if (result.rows.length === 0) {
            throw new Error("Guest session data not found");
        }

        const {
            guest_id,
            tenant_id,
            branch_id,
            table_id
        } = result.rows[0];

        await pool.query(
            `
            INSERT INTO assistance_requests
            (
                guest_id,
                tenant_id,
                branch_id,
                table_id,
                type,
                message,
                status
            )
            VALUES
            ($1, $2, $3, $4, 'WATER', 'Need drinking water', 'PENDING'),
            ($1, $2, $3, $4, 'BILL', 'Please bring the bill', 'PENDING'),
            ($1, $2, $3, $4, 'WAITER', 'Need waiter assistance', 'PENDING');
            `,
            [
                guest_id,
                tenant_id,
                branch_id,
                table_id
            ]
        );

        logger.info("Assistance sample data inserted successfully");
    } catch (error) {
        logger.error("Assistance seed failed", {
            error: error.message
        });

        throw error;
    } finally {
        await pool.end();
    }
};

seedAssistance();