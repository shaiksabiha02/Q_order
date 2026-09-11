import db from '../config/db.js';

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS menu_categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE,
            branch_id UUID NOT NULL REFERENCES branches(id) ON UPDATE CASCADE ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            display_order INT DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE,
            created_by UUID REFERENCES staff_users(id) ON UPDATE CASCADE ON DELETE SET NULL
        );
    `);
}

export async function down() {
    await db.query(`DROP TABLE IF EXISTS menu_categories CASCADE;`);
}