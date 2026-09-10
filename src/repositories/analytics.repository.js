import pool from "../config/db.js";

const getGMV = async () => {
    const query = `
        SELECT
            COALESCE(SUM(total_amount), 0) AS total_gmv,
            COUNT(*) AS total_orders
        FROM orders
        WHERE status != 'CANCELLED';
    `;

    const result = await pool.query(query);

    return result.rows[0];
};

export default {
    getGMV
};