import pool from "../config/db.js";

async function createPaymentTables() {
    try {

        // Payment Ledger Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payment_ledger (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                transaction_reference VARCHAR(100) UNIQUE NOT NULL,
                payment_intent_id VARCHAR(100) UNIQUE,
                amount DECIMAL(10,2) NOT NULL,
                gateway_provider VARCHAR(50) NOT NULL,
                status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING','CAPTURED','FAILED','REFUNDED')),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Payment Ledger table created");

        
        // Cash Payment Requests Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS cash_payment_requests (
                id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
                order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                status VARCHAR(30) DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED','ACCEPTED','COLLECTED','CANCELLED')),
                created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Cash Payment Requests table created");

        process.exit();

    } catch (error) {
        console.log("Migration failed:", error);
        process.exit(1);
    }
}

createPaymentTables();