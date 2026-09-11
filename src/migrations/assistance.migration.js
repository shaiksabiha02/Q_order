import pool from "../config/db.js";
import logger from "../config/logger.js";

const query = `
DROP TABLE IF EXISTS assistance_requests;

CREATE TABLE assistance_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    guest_id UUID NOT NULL,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES dining_tables(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('WATER', 'BILL', 'WAITER')),
    message TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
        CHECK (status IN ('PENDING', 'IN_PROGRESS', 'RESOLVED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assistance_requests_branch_status
ON assistance_requests(branch_id, status);

CREATE INDEX idx_assistance_requests_table
ON assistance_requests(table_id);

CREATE INDEX idx_assistance_requests_guest
ON assistance_requests(guest_id);
`;

const runMigration = async () => {
    try {
        await pool.query(query);

        logger.info("Assistance requests table created successfully");
    } catch (error) {
        logger.error("Assistance requests migration failed", {
            error: error.message
        });

        throw error;
    } finally {
        await pool.end();
    }
};

runMigration();