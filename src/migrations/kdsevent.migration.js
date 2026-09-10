export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS kds_events (
      event_id BIGSERIAL PRIMARY KEY,

      tenant_id UUID NOT NULL
        REFERENCES tenants(id) ON DELETE CASCADE,

      branch_id UUID NOT NULL
        REFERENCES branches(id) ON DELETE CASCADE,

      order_id UUID
        REFERENCES orders(id) ON DELETE CASCADE,

      order_item_id UUID
        REFERENCES order_items(id) ON DELETE CASCADE,

      event_type VARCHAR(40) NOT NULL
        CHECK (
          event_type IN (
            'NEW_ORDER_RECEIVED',
            'ITEM_STATUS_CHANGED',
            'ORDER_STATUS_UPDATED'
          )
        ),

      payload JSONB NOT NULL DEFAULT '{}'::jsonb,

      created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_kds_events_branch_event
      ON kds_events (branch_id, event_id);

    CREATE INDEX IF NOT EXISTS idx_kds_events_order
      ON kds_events (order_id);

    ALTER TABLE kds_events ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS kds_events_tenant_isolation
      ON kds_events;

    CREATE POLICY kds_events_tenant_isolation
      ON kds_events
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