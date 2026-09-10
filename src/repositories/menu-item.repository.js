import db from '../config/db.js';

export async function getMenuItems({
    categoryId,
    dietary_tag,
    is_available,
    limit,
    offset
}) {
    let query =
        'SELECT id,tenant_id,category_id,name,description,base_price,image_url,dietary_tag,is_available,created_at,created_by,updated_by,station_id FROM menu_items WHERE 1=1';

    const params = [];

    if (categoryId) {
        params.push(categoryId);
        query += ` AND category_id = $${params.length}`;
    }

    if (dietary_tag) {
        params.push(dietary_tag);
        query += ` AND dietary_tag = $${params.length}`;
    }

    if (is_available !== undefined && is_available !== null) {
        params.push(is_available);
        query += ` AND is_available = $${params.length}`;
    }

    params.push(limit);
    query += ` ORDER BY created_at DESC LIMIT $${params.length}`;

    params.push(offset);
    query += ` OFFSET $${params.length}`;

    const result = await db.query(query, params);
    const countParams = [];
    let countQuery = 'SELECT COUNT(*) FROM menu_items WHERE 1=1';

    if (categoryId) {
        countParams.push(categoryId);
        countQuery += ` AND category_id = $${countParams.length}`;
    }

    if (dietary_tag) {
        countParams.push(dietary_tag);
        countQuery += ` AND dietary_tag = $${countParams.length}`;
    }

    if (is_available !== undefined && is_available !== null) {
        countParams.push(is_available);
        countQuery += ` AND is_available = $${countParams.length}`;
    }

    const countResult = await db.query(countQuery, countParams);
    const total = Number(countResult.rows[0].count);

    return { rows: result.rows, total };
}

export async function getMenuItemById(id) {
    const result = await db.query(
        'SELECT id,tenant_id,category_id,name,description,base_price,image_url,dietary_tag,is_available,created_at,created_by,updated_by,station_id FROM menu_items WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
}

export async function createMenuItem(data) {
    const result = await db.query(
        'INSERT INTO menu_items (tenant_id, category_id, name, description, base_price, image_url, dietary_tag, is_available, created_by, station_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',
        [
            data.tenant_id,
            data.category_id,
            data.name,
            data.description,
            data.base_price,
            data.image_url,
            data.dietary_tag,
            data.is_available ?? true,
            data.created_by,
            data.station_id
        ]
    );
    return result.rows[0];
}

export async function updateMenuItem(id, data) {
    const result = await db.query(
        'UPDATE menu_items SET category_id = $1, name = $2, description = $3, base_price = $4, image_url = $5, dietary_tag = $6, updated_by = $7 WHERE id = $8 RETURNING *',
        [
            data.category_id,
            data.name,
            data.description,
            data.base_price,
            data.image_url,
            data.dietary_tag,
            data.updated_by,
            id
        ]
    );
    return result.rows[0] || null;
}

export async function toggleMenuItemStock(id, is_available) {
    const result = await db.query(
        'UPDATE menu_items SET is_available = $1 WHERE id = $2 RETURNING *',
        [is_available, id]
    );
    return result.rows[0] || null;
}