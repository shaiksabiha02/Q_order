import db from '../config/db.js';

export async function getModifierGroups() {
    const result = await db.query(`
        SELECT id, tenant_id, name, min_selection, max_selection, created_by
        FROM modifier_groups
        ORDER BY name
    `);
    return result.rows;
}

export async function getModifierGroupById(id) {
    const result = await db.query(`
        SELECT id, tenant_id, name, min_selection, max_selection, created_by
        FROM modifier_groups WHERE id = $1
    `, [id]);
    return result.rows[0] || null;
}

export async function createModifierGroup(data) {
    const result = await db.query(`
        INSERT INTO modifier_groups (tenant_id, name, min_selection, max_selection, created_by)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
    `, [data.tenant_id, data.name, data.min_selection, data.max_selection || 0, data.created_by]);
    return result.rows[0];
}

export async function updateModifierGroup(id, data) {
    const result = await db.query(`
        UPDATE modifier_groups
        SET name = $1, min_selection = $2, max_selection = $3
        WHERE id = $4
        RETURNING *
    `, [data.name, data.min_selection, data.max_selection, id]);
    return result.rows[0] || null;
}

export async function deleteModifierGroup(id) {
    const result = await db.query(`
        DELETE FROM modifier_groups WHERE id = $1 RETURNING *
    `, [id]);
    return result.rows[0] || null;
}