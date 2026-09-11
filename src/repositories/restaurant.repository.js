import pool from "../config/db.js";

export const getRestaurantProfile = async (
    tenantId,
    branchId
) => {
    const query = `
        SELECT
            b.id,
            b.tenant_id,
            b.name,
            b.address,
            b.timezone,
            b.currency,
            b.tax_rate,
            b.created_at
        FROM branches b
        WHERE b.tenant_id = $1
          AND b.id = $2
        LIMIT 1;
    `;

    const result = await pool.query(
        query,
        [
            tenantId,
            branchId,
        ]
    );

    return result.rows[0];
};