import db from '../config/db.js';

export async function getCategories(limit, offset) {

    const result = await db.query(`
        SELECT
            id,
            tenant_id,
            branch_id,
            name,
            display_order,
            is_active,
            created_by
        FROM menu_categories
        ORDER BY display_order, name
        LIMIT $1 OFFSET $2
    `, [limit, offset]);
    const countResult = await db.query(`
        SELECT COUNT(*) FROM menu_categories
    `);

    return { rows: result.rows, total: Number(countResult.rows[0].count) };
}    