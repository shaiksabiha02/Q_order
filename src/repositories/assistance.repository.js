import pool from "../config/db.js";

export const createAssistanceRequest = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO assistance_requests
        (
            id,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            type,
            message
        )
        SELECT
            $1,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            $3,
            $4
        FROM guest_sessions
        WHERE guest_id = $2
          AND table_id = $5
        ORDER BY created_at DESC
        LIMIT 1
        RETURNING
            id,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            type,
            message,
            status;
        `,
        [
            data.id,
            data.guest_id,
            data.type,
            data.message ?? null,
            data.table_id
        ]
    );

    return result.rows[0];
};

export const getAssistanceRequests = async (page, limit) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `
        SELECT
            id,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            type,
            message,
            status,
            created_at,
            updated_at
        FROM assistance_requests
        WHERE status != 'RESOLVED'
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
        `,
        [limit, offset]
    );

    return result.rows;
};

export const resolveAssistanceRequest = async (id, status) => {
    const result = await pool.query(
        `
        UPDATE assistance_requests
        SET
            status = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND status != 'RESOLVED'
        RETURNING
            id,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            type,
            message,
            status;
        `,
        [id, status]
    );

    return result.rows[0];
};