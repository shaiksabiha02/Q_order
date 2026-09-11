import db from '../config/db.js';

export async function up() {
    await db.query(`
        CREATE TABLE IF NOT EXISTS menu_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            tenant_id UUID NOT NULL REFERENCES tenants(id) ON UPDATE CASCADE ON DELETE CASCADE,
            category_id UUID NOT NULL REFERENCES menu_categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            base_price DECIMAL(10, 2) NOT NULL,
            dietary_tag VARCHAR(50)
               CHECK (dietary_tag IN ('VEG','NON_VEG', 'VEGAN', 'GLUTEN_FREE')),
            is_available BOOLEAN DEFAULT true,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            created_by UUID REFERENCES staff_users(id) ON UPDATE CASCADE ON DELETE SET NULL,
            updated_by UUID REFERENCES staff_users(id) ON UPDATE CASCADE ON DELETE SET NULL,
            station_id UUID REFERENCES kitchen_stations(id) ON UPDATE CASCADE ON DELETE SET NULL   
        );
        CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id);
        CREATE INDEX IF NOT EXISTS idx_menu_items_stations ON menu_items(station_id);
    `);
}

export async function down() {
    await db.query(`DROP TABLE IF EXISTS menu_items CASCADE;`);
}