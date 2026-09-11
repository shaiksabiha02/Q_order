import pool from "../config/db.js";

const createBranch = async (
    tenant_id,
    name,
    address,
    timezone,
    currency,
    tax_rate
) => {
    const query = `
        INSERT INTO branches (
            tenant_id,
            name,
            address,
            timezone,
            currency,
            tax_rate
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        tenant_id,
        name,
        address,
        timezone || "UTC",
        currency || "USD",
        tax_rate || 0.00
    ]);

    return result.rows[0];
};

export default {
    createBranch
};