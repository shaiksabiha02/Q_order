import pool from "../config/db.js";

const query = `
CREATE TABLE IF NOT EXISTS staff_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID REFERENCES branches(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    pin_code VARCHAR(10),
    role VARCHAR(30) NOT NULL
        CHECK (role IN (
            'SUPER_ADMIN',
            'STORE_ADMIN',
            'WAITER',
            'KITCHEN_STAFF'
        )),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const runMigration = async () => {
    try {
        await pool.query(query);
        console.log("Staff users table created successfully");
    } catch (error) {
        console.error("Error creating staff_users table:", error);
    } finally {
        await pool.end();
    }
};

runMigration();