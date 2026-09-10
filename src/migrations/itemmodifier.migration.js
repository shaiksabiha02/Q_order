export async function up(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS order_item_modifiers (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

      order_item_id UUID NOT NULL
        REFERENCES order_items(id) ON DELETE CASCADE,

      modifier_option_id UUID
        REFERENCES modifier_options(id) ON DELETE SET NULL,

      option_name VARCHAR(100) NOT NULL,

      price_delta DECIMAL(10,2)
        NOT NULL DEFAULT 0.00,

      created_at TIMESTAMP WITH TIME ZONE
        DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_order_item_modifiers_order_item
      ON order_item_modifiers (order_item_id);
  `);
}