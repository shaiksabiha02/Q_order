import db from '../config/db.js';

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS item_modifier_groups (
            item_id UUID NOT NULL REFERENCES menu_items(id) ON UPDATE CASCADE ON DELETE CASCADE,
            group_id UUID NOT NULL REFERENCES modifier_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
            PRIMARY KEY (item_id, group_id)
        );
    `);
}

export async function down() {
    await db.query(`DROP TABLE IF EXISTS item_modifier_groups CASCADE;`);
}