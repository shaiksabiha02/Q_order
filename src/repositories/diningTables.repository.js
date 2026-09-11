import pool from "../config/db.js";

export const getTables = async (
    tenantId,
    branchId
) => {
    const query = `
        SELECT
            id,
            tenant_id,
            branch_id,
            floor_id,
            table_number,
            capacity,
            status,
            created_at,
            updated_at
        FROM dining_tables
        WHERE tenant_id = $1
          AND branch_id = $2
        ORDER BY floor_id, table_number;
    `;

    const result = await pool.query(
        query,
        [tenantId, branchId]
    );

    return result.rows;
};

export const getTableById = async (
    id,
    tenantId,
    branchId
) => {
    const query = `
        SELECT
            id,
            tenant_id,
            branch_id,
            floor_id,
            table_number,
            capacity,
            status,
            created_at,
            updated_at
        FROM dining_tables
        WHERE id = $1
          AND tenant_id = $2
          AND branch_id = $3;
    `;

    const result = await pool.query(
        query,
        [
            id,
            tenantId,
            branchId,
        ]
    );

    return result.rows[0];
};

export const clearTable = async (
    id,
    tenantId,
    branchId
) => {
    const query = `
        UPDATE dining_tables
        SET
            status = 'VACANT',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
          AND tenant_id = $2
          AND branch_id = $3
        RETURNING
            id,
            tenant_id,
            branch_id,
            floor_id,
            table_number,
            capacity,
            status,
            created_at,
            updated_at;
    `;

    const result = await pool.query(
        query,
        [
            id,
            tenantId,
            branchId,
        ]
    );

    return result.rows[0];
};