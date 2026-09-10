import db from '../config/db.js';

export async function getItemModifierGroups() {
    const result = await db.query(`
        SELECT item_id, group_id FROM item_modifier_groups ORDER BY item_id
    `);
    return result.rows;
}

export async function addItemModifierGroup(data) {
    const result = await db.query(
        'INSERT INTO item_modifier_groups (item_id, group_id) VALUES ($1, $2) RETURNING *',
        [data.item_id, data.group_id]
    );
    return result.rows[0];
}

export async function removeItemModifierGroup(item_id, group_id) {
    const result = await db.query(
        'DELETE FROM item_modifier_groups WHERE item_id = $1 AND group_id = $2 RETURNING *',
        [item_id, group_id]
    );
    return result.rows[0] || null;
}