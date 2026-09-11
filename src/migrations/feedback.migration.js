import pool from "../config/db.js";

const query = `

CREATE TABLE IF NOT EXISTS feedbacks (

    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,

    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,

    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,

    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),

    comments TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);

CREATE INDEX IF NOT EXISTS idx_feedbacks_order
ON feedbacks(order_id);

CREATE INDEX IF NOT EXISTS idx_feedbacks_branch
ON feedbacks(branch_id);

`;

const runMigration = async () => {

    await pool.query(query);

    console.log("Feedbacks table created successfully");

    await pool.end();

};

runMigration();