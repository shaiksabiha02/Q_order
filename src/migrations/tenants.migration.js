import pool from "../config/db.js";

const query = `

CREATE TABLE IF NOT EXISTS tenants (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    company_name VARCHAR(150) NOT NULL,

    tax_identifier VARCHAR(50) NOT NULL,

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'SUSPENDED')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

CREATE INDEX IF NOT EXISTS idx_tenants_status
ON tenants(status);

`;

const runMigration = async () => {

    try {

        await pool.query(query);

        console.log("Tenants table created successfully");

    } catch (error) {

        console.error("Error creating tenants table:", error);

    } finally {

        await pool.end();

    }

};

runMigration();