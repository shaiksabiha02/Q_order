import pool from "../config/db.js";

export const findStaffByUsername = async (username) => {
    const query = `
        SELECT
            id,
            tenant_id,
            branch_id,
            username,
            pin_code,
            role
        FROM staff_users
        WHERE username = $1
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [username]
    );

    return result.rows[0];
};

export const findStaffById = async (staffUserId) => {
    const query = `
        SELECT
            id,
            tenant_id,
            branch_id,
            username,
            role
        FROM staff_users
        WHERE id = $1
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [staffUserId]
    );

    return result.rows[0];
};

export const createAuthSession = async (
    staffUserId,
    refreshTokenHash,
    expiresAt
) => {
    const query = `
        INSERT INTO auth_sessions (
            staff_user_id,
            refresh_token_hash,
            expires_at
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            staff_user_id,
            expires_at,
            created_at;
    `;

    const result = await pool.query(
        query,
        [
            staffUserId,
            refreshTokenHash,
            expiresAt,
        ]
    );

    return result.rows[0];
};

export const findAuthSessionByRefreshTokenHash = async (
    refreshTokenHash
) => {
    const query = `
        SELECT
            id,
            staff_user_id,
            refresh_token_hash,
            expires_at,
            revoked_at
        FROM auth_sessions
        WHERE refresh_token_hash = $1
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [refreshTokenHash]
    );

    return result.rows[0];
};

export const revokeAuthSession = async (sessionId) => {
    const query = `
        UPDATE auth_sessions
        SET revoked_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND revoked_at IS NULL
        RETURNING
            id,
            revoked_at;
    `;

    const result = await pool.query(
        query,
        [sessionId]
    );

    return result.rows[0];
};