import db from '../config/db.js';

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS modifier_options (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            group_id UUID NOT NULL REFERENCES modifier_groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            price_delta DECIMAL(10, 2) DEFAULT 0.00
        );
    `);
}

export async function down() {
    await db.query(`DROP TABLE IF EXISTS modifier_options CASCADE;`);
}
