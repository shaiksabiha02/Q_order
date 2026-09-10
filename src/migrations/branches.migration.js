import pool from "../config/db.js";

const query = `

CREATE TABLE IF NOT EXISTS branches (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    name VARCHAR(100) NOT NULL,

    address TEXT,

    timezone VARCHAR(50) DEFAULT 'UTC',

    currency VARCHAR(10) DEFAULT 'USD',

    tax_rate DECIMAL(5,2) DEFAULT 0.00,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

CREATE INDEX IF NOT EXISTS idx_branches_tenant
ON branches(tenant_id);

`;

const runMigration = async () => {

    try {

        await pool.query(query);

        console.log("Branches table created successfully");

    } catch (error) {

        console.error("Error creating branches table:", error);

    } finally {

        await pool.end();

    }

};

runMigration();