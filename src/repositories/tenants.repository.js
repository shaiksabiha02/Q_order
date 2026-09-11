import pool from "../config/db.js";

const createTenant = async (
    company_name,
    tax_identifier,
    status
) => {
    const query = `
        INSERT INTO tenants (
            company_name,
            tax_identifier,
            status
        )
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const result = await pool.query(query, [
        company_name,
        tax_identifier,
        status || "ACTIVE"
    ]);

    return result.rows[0];
};


const getAllTenants = async () => {
    const query = `
        SELECT
            id,
            company_name,
            tax_identifier,
            status,
            created_at
        FROM tenants
        ORDER BY created_at DESC;
    `;

    const result = await pool.query(query);

    return result.rows;
};


const updateTenantStatus = async (id, status) => {
    const query = `
        UPDATE tenants
        SET status = $1
        WHERE id = $2
        RETURNING *;
    `;

    const result = await pool.query(query, [
        status,
        id
    ]);

    return result.rows[0];
};


export default {
    createTenant,
    getAllTenants,
    updateTenantStatus
};