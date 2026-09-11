import pool from "../config/db.js";

export const createFeedback = async (data) => {
    const result = await pool.query(
        `
        INSERT INTO feedbacks
        (tenant_id, branch_id, order_id, rating, comments)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `,
        [
            data.tenant_id,
            data.branch_id,
            data.order_id,
            data.rating,
            data.comments || null
        ]
    );

    return result.rows[0];
};