import pool from "../config/db.js";

const query = `
CREATE TABLE IF NOT EXISTS carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES dining_tables(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL,
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
`;

const runMigration = async () => {
    try {
        await pool.query(query);
        console.log("Carts and cart_items tables created successfully");
    } catch (error) {
        console.error("Error creating cart tables:", error);
    } finally {
        await pool.end();
    }
};

runMigration();