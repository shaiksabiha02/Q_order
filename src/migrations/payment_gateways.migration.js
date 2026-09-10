import pool from "../config/db.js";

const query = `

CREATE TABLE IF NOT EXISTS payment_gateways (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL
        REFERENCES tenants(id)
        ON DELETE CASCADE,

    gateway_name VARCHAR(50) NOT NULL,

    gateway_account_id VARCHAR(255),

    api_key VARCHAR(500),

    secret_key VARCHAR(500),

    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
        CHECK (status IN ('ACTIVE', 'INACTIVE')),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

CREATE INDEX IF NOT EXISTS idx_payment_gateways_tenant
ON payment_gateways(tenant_id);

CREATE INDEX IF NOT EXISTS idx_payment_gateways_status
ON payment_gateways(status);

`;

const runMigration = async () => {

    try {

        await pool.query(query);

        console.log("Payment gateways table created successfully");

    } catch (error) {

        console.error(
            "Error creating payment_gateways table:",
            error
        );

    } finally {

        await pool.end();

    }

};

runMigration();