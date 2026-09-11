import pool from '../config/db.js';

export class OrderRepository {
  static async getTransactionClient(tenantId) {
    const client = await pool.connect();
    await client.query('BEGIN');
    if (tenantId) {
      await client.query(`SELECT set_config('app.current_tenantId', $1, true);`, [tenantId]);
    }
    return client;
  }

  static async findByIdempotencyKey(tenantId, idempotencyKey) {
    const query = `
      SELECT id, status, total_amount 
      FROM orders 
      WHERE tenant_id = $1 AND idempotency_key = $2
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [tenantId, idempotencyKey]);
    return rows[0] || null;
  }

  static async getActiveCartWithItems(client, tenantId, cartItemId) {
    const query = `
      SELECT 
        c.id as cart_id,
        c.guest_id,
        c.branch_id,
        c.table_id,
        c.discount,
        c.platform_fee,
        ci.id as cart_item_id,
        ci.item_id,
        ci.qty,
        ci.notes,
        m.name as item_name,
        m.base_price,
        m.is_available
      FROM cart_items ci
      JOIN carts c ON ci.cart_id = c.id
      JOIN menu_items m ON ci.item_id = m.id
      WHERE ci.id = $1 
        AND c.tenant_id = $2 
        AND c.status = 'ACTIVE';
    `;
    const { rows } = await client.query(query, [cartItemId, tenantId]);
    return rows;
  }

  static async createOrder(client, orderData) {
    const {
      tenant_id,
      branch_id,
      table_id,
      idempotency_key,
      cart_item_id,
      guest_id,
      subtotal,
      tax_amount,
      total_amount,
      status = 'RECEIVED'
    } = orderData;

    const query = `
      INSERT INTO orders (
        tenant_id, branch_id, table_id, idempotency_key,
        guest_id, status, subtotal, tax_amount, total_amount, cart_item_id
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *;
    `;
    const values = [
      tenant_id,
      branch_id,
      table_id,
      idempotency_key,
      guest_id,
      status,
      subtotal,
      tax_amount,
      total_amount,
      cart_item_id
    ];
    const { rows } = await client.query(query, values);
    return rows[0];
  }

  static async createOrderItems(client, orderId, items) {
    const insertedItems = [];
    for (const item of items) {
      const query = `
        INSERT INTO order_items (
          order_id, menu_item_id, quantity, unit_price, notes, status
        ) VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const values = [
        orderId,
        item.item_id,
        item.qty,
        item.unit_price,
        item.notes || null,
        'PENDING'
      ];
      const { rows } = await client.query(query, values);
      insertedItems.push(rows[0]);
    }
    return insertedItems;
  }

  static async markCartCompleted(client, cartId) {
    await client.query(
      `UPDATE carts SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE id = $1;`,
      [cartId]
    );
  }

  static async getSessionHistory(tenantId, branchId, tableId) {
    const query = `
      SELECT 
        o.id as order_id,
        o.status,
        o.subtotal,
        o.tax_amount,
        o.total_amount,
        o.created_at,
        COALESCE(
          json_agg(
            json_build_object(
              'item_id', oi.id,
              'menu_item_id', oi.menu_item_id,
              'quantity', oi.quantity,
              'unit_price', oi.unit_price,
              'notes', oi.notes,
              'status', oi.status
            )
          ) FILTER (WHERE oi.id IS NOT NULL), '[]'
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.tenant_id = $1 
        AND o.branch_id = $2 
        AND o.table_id = $3
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `;
    const { rows } = await pool.query(query, [tenantId, branchId, tableId]);
    return rows;
  }

  static async findOrderById(tenantId, orderId) {
    const query = `
      SELECT id, status, subtotal, tax_amount, total_amount, created_at, table_id, branch_id
      FROM orders
      WHERE tenant_id = $1 AND id = $2;
    `;
    const { rows } = await pool.query(query, [tenantId, orderId]);
    return rows[0] || null;
  }

  static async updateOrderStatus(tenantId, orderId, status) {
    const query = `
      UPDATE orders
      SET status = $1
      WHERE tenant_id = $2 AND id = $3
      RETURNING id, status, branch_id;
    `;
    const { rows } = await pool.query(query, [status, tenantId, orderId]);
    return rows[0] || null;
  }
}