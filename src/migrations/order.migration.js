import pool from '../config/db.js';
import logger from '../config/logger.js';

async function createTable() {
    await pool.query(`
    CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    table_id UUID REFERENCES dining_tables(id) ON DELETE SET NULL,
    idempotency_key UUID UNIQUE NOT NULL,
    status VARCHAR(30) DEFAULT 'RECEIVED' CHECK (status IN ('RECEIVED', 'PREPARING','READY', 'SERVED', 'COMPLETED', 'CANCELLED')),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    cart_item_id UUID  REFERENCES cart_items(id) ON DELETE CASCADE

    );
    
    CREATE INDEX idx_orders_branch_status ON orders(branch_id, status);
    
    CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID NOT NULL REFERENCES menu_items(id),
    quantity INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PREPARING','READY'))
);
`);
logger.info("orders & order_items tables CREATED successfully.");
    process.exit();
};
createTable();





 
   