import pool from "../config/db.js";

export const findTableByQrToken = async (qrToken) => {
    const query = `
        SELECT
            id,
            tenant_id,
            branch_id,
            floor_id,
            table_number,
            capacity,
            status
        FROM dining_tables
        WHERE qr_secret_token = $1
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [qrToken]
    );

    return result.rows[0];
};

export const createGuestSession = async (
    guestId,
    tenantId,
    branchId,
    tableId,
    accessToken,
    refreshToken,
    expiresAt
) => {
    const query = `
        INSERT INTO guest_sessions (
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            access_token,
            refresh_token,
            expires_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING
            id,
            guest_id,
            tenant_id,
            branch_id,
            table_id,
            access_token,
            refresh_token,
            created_at,
            expires_at;
    `;

    const result = await pool.query(
        query,
        [
            guestId,
            tenantId,
            branchId,
            tableId,
            accessToken,
            refreshToken,
            expiresAt,
        ]
    );

    return result.rows[0];
};