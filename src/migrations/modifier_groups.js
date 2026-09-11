import db from '../config/db.js';

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS modifier_groups (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            min_selection INT DEFAULT 0,
            max_selection INT DEFAULT 0,
            created_by UUID REFERENCES staff_users(id) ON UPDATE CASCADE ON DELETE SET NULL
        );
    `);
}

export async function down() {
    await db.query(`DROP TABLE IF EXISTS modifier_groups CASCADE;`);
}