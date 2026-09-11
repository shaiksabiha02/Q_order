export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS menu_item_stations (
      menu_item_id UUID NOT NULL
        REFERENCES menu_items(id) ON DELETE CASCADE,

      station_id UUID NOT NULL
        REFERENCES kitchen_stations(id) ON DELETE CASCADE,

      created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP,

      PRIMARY KEY (menu_item_id, station_id)
    );

    CREATE INDEX IF NOT EXISTS idx_menu_item_stations_station
      ON menu_item_stations (station_id);

    ALTER TABLE order_items
      ADD COLUMN IF NOT EXISTS station_id UUID
      REFERENCES kitchen_stations(id) ON DELETE SET NULL;

    CREATE INDEX IF NOT EXISTS idx_order_items_station_status
      ON order_items (station_id, status);

    CREATE INDEX IF NOT EXISTS idx_order_items_order
      ON order_items (order_id);
  `);
}