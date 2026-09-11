import pool from "../config/db.js";

const findUserByUsername = async (username) => {
    const query = `
        SELECT
            id,
            username,
            password_hash,
            role,
            tenant_id,
            branch_id
        FROM staff_users
        WHERE username = $1;
    `;

    const result = await pool.query(query, [username]);

    return result.rows[0];
};

export {
    findUserByUsername
};