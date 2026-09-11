import db from '../config/db.js';

export async function getModifierOptions() {
    const result = await db.query('SELECT id, group_id, name, price_delta FROM modifier_options ORDER BY name');
    return result.rows;
}

export async function getModifierOptionById(id) {
    const result = await db.query('SELECT id, group_id, name, price_delta FROM modifier_options WHERE id = $1', [id]);
    return result.rows[0] || null;
}
export async function createModifierOption(data) {
    const result = await db.query(
        'INSERT INTO modifier_options (group_id, name, price_delta) VALUES ($1, $2, $3) RETURNING *',
        [data.group_id, data.name, data.price_delta]
    );
    return result.rows[0];
}
export async function updateModifierOption(id, data) {
    const result = await db.query(
        'UPDATE modifier_options SET group_id = $1, name = $2, price_delta = $3 WHERE id = $4 RETURNING *',
        [data.group_id, data.name, data.price_delta, id]
    );
    return result.rows[0] || null;
}
export async function deleteModifierOption(id) {
    const result = await db.query('DELETE FROM modifier_options WHERE id = $1 RETURNING *', [id]);
    return result.rows[0] || null;
}