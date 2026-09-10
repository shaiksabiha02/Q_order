import pool from "../config/db.js";
import logger from "../config/logger.js";

const query = `
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES dining_tables(id) ON DELETE CASCADE,
    guest_id UUID REFERENCES guest_sessions(guest_id),
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    discount NUMERIC(10, 2) DEFAULT 0.00,
    platform_fee NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
    variant_id UUID,
    modifier_ids JSONB DEFAULT '[]'::jsonb,
    qty INT NOT NULL CHECK (qty > 0),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cart_items_cart
ON cart_items(cart_id);

CREATE INDEX IF NOT EXISTS idx_cart_items_guest
ON carts(guest_id);

CREATE INDEX IF NOT EXISTS idx_carts_table
ON carts(table_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_active_cart_table
ON carts(table_id)
WHERE status = 'ACTIVE';
`;

const runMigration = async () => {
    try {
        await pool.query(query);
        logger.info("Carts and cart_items tables created successfully");
    } catch (error) {
        logger.error("Error creating cart tables", {
            message: error.message,
            stack: error.stack
        });
    } finally {
        await pool.end();
    }
};

runMigration();