export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS kitchen_stations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
      name VARCHAR(50) NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      UNIQUE (branch_id, name)
    );

    CREATE INDEX IF NOT EXISTS idx_kitchen_stations_tenant_branch
      ON kitchen_stations (tenant_id, branch_id);

    ALTER TABLE kitchen_stations ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS kitchen_stations_tenant_isolation
      ON kitchen_stations;

    CREATE POLICY kitchen_stations_tenant_isolation
      ON kitchen_stations
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