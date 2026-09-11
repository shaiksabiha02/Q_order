import pool from "../config/db.js";

const createPaymentGateway = async (
    tenant_id,
    gateway_name,
    gateway_account_id,
    api_key,
    secret_key,
    status
) => {
    const query = `
        INSERT INTO payment_gateways (
            tenant_id,
            gateway_name,
            gateway_account_id,
            api_key,
            secret_key,
            status
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING
            id,
            tenant_id,
            gateway_name,
            gateway_account_id,
            status,
            created_at;
    `;

    const result = await pool.query(query, [
        tenant_id,
        gateway_name,
        gateway_account_id,
        api_key,
        secret_key,
        status || "ACTIVE"
    ]);

    return result.rows[0];
};

export default {
    createPaymentGateway
};