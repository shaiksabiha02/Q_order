export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS kds_print_jobs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

      tenant_id UUID NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,

      branch_id UUID NOT NULL
        REFERENCES branches(id) ON DELETE CASCADE,

      order_id UUID NOT NULL
        REFERENCES orders(id) ON DELETE CASCADE,

      printer_ip VARCHAR(45) NOT NULL,

      raw_bytes BYTEA NOT NULL,

      status VARCHAR(20)
        NOT NULL DEFAULT 'PENDING'
        CHECK (
          status IN (
            'PENDING',
            'PRINTED',
            'FAILED'
          )
        ),

      attempts INT NOT NULL DEFAULT 0
        CHECK (attempts >= 0),

      last_error TEXT,

      created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP,

      printed_at TIMESTAMP WITH TIME ZONE
    );

    CREATE INDEX IF NOT EXISTS idx_kds_print_jobs_order
      ON kds_print_jobs (order_id);

    CREATE INDEX IF NOT EXISTS idx_kds_print_jobs_status
      ON kds_print_jobs (branch_id, status);

    ALTER TABLE kds_print_jobs ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS kds_print_jobs_tenant_isolation
      ON kds_print_jobs;

    CREATE POLICY kds_print_jobs_tenant_isolation
      ON kds_print_jobs
      FOR ALL
      USING (
        tenant_id =
        NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
      )
      WITH CHECK (
        tenant_id =
        NULLIF(current_setting('app.current_tenant_id', true), '')::UUID
      );
  `);
}