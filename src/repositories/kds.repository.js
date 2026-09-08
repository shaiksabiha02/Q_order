import pool from "../config/db.js";

const getOrdersByStation = async (
  stationId,
  tenantId,
  branchId
) => {
  const query = `
    SELECT
      o.id AS order_id,
      o.table_id,
      o.status AS order_status,
      o.created_at,
      oi.id AS order_item_id,
      oi.menu_item_id,
      oi.quantity,
      oi.notes,
      oi.status AS item_status,
      mi.name AS item_name,
      ks.name AS station_name
    FROM order_items oi
    JOIN orders o
      ON o.id = oi.order_id
    JOIN menu_items mi
      ON mi.id = oi.menu_item_id
    JOIN kitchen_stations ks
      ON ks.id = oi.station_id
    WHERE LOWER(ks.name) = LOWER($1)
      AND o.tenant_id = $2
      AND o.branch_id = $3
      AND oi.status IN ('PENDING', 'PREPARING')
      AND o.status NOT IN ('COMPLETED', 'CANCELLED')
    ORDER BY o.created_at ASC
  `;

  const values = [
    stationId,
    tenantId,
    branchId
  ];

  const result = await pool.query(query, values);

  return result.rows;
};


const updateItemStatusInDb = async (
  itemId,
  status,
  tenantId,
  branchId
) => {
  const query = `
    UPDATE order_items oi
    SET status = $1
    FROM orders o
    WHERE oi.order_id = o.id
      AND oi.id = $2
      AND o.tenant_id = $3
      AND o.branch_id = $4
    RETURNING
      oi.id AS order_item_id,
      oi.order_id,
      oi.status
  `;

  const values = [
    status,
    itemId,
    tenantId,
    branchId
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};
const getKdsEvents = async (
  tenantId,
  branchId,
  lastEventId
) => {
  const query = `
    SELECT
      event_id,
      order_id,
      order_item_id,
      event_type,
      payload,
      created_at
    FROM kds_events
    WHERE tenant_id = $1
      AND branch_id = $2
      AND event_id > $3
    ORDER BY event_id ASC
  `;

  const values = [
    tenantId,
    branchId,
    lastEventId
  ];

  const result = await pool.query(query, values);

  return result.rows;
};
const createPrintJob = async (
  tenantId,
  branchId,
  orderId,
  printerIp,
  rawBytes
) => {
  const query = `
    INSERT INTO kds_print_jobs (
      tenant_id,
      branch_id,
      order_id,
      printer_ip,
      raw_bytes
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING
      id,
      order_id,
      printer_ip,
      status,
      created_at
  `;

  const values = [
    tenantId,
    branchId,
    orderId,
    printerIp,
    Buffer.from(rawBytes)
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

export {
  getOrdersByStation,
  updateItemStatusInDb,
  getKdsEvents,
  createPrintJob

};