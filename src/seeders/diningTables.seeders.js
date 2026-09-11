INSERT INTO dining_tables (
    tenant_id,
    branch_id,
    floor_id,
    table_number,
    capacity,
    qr_secret_token,
    status
)
SELECT
    t.id,
    b.id,
    'FLOOR-1',
    'T01',
    4,
    'qr-secret-t01',
    'VACANT'
FROM tenants t
JOIN branches b
    ON b.tenant_id = t.id
WHERE NOT EXISTS (
    SELECT 1
    FROM dining_tables dt
    WHERE dt.branch_id = b.id
      AND dt.floor_id = 'FLOOR-1'
      AND dt.table_number = 'T01'
)
LIMIT 1;


INSERT INTO dining_tables (
    tenant_id,
    branch_id,
    floor_id,
    table_number,
    capacity,
    qr_secret_token,
    status
)
SELECT
    t.id,
    b.id,
    'FLOOR-1',
    'T02',
    4,
    'qr-secret-t02',
    'VACANT'
FROM tenants t
JOIN branches b
    ON b.tenant_id = t.id
WHERE NOT EXISTS (
    SELECT 1
    FROM dining_tables dt
    WHERE dt.branch_id = b.id
      AND dt.floor_id = 'FLOOR-1'
      AND dt.table_number = 'T02'
)
LIMIT 1;


INSERT INTO dining_tables (
    tenant_id,
    branch_id,
    floor_id,
    table_number,
    capacity,
    qr_secret_token,
    status
)
SELECT
    t.id,
    b.id,
    'FLOOR-2',
    'T03',
    6,
    'qr-secret-t03',
    'VACANT'
FROM tenants t
JOIN branches b
    ON b.tenant_id = t.id
WHERE NOT EXISTS (
    SELECT 1
    FROM dining_tables dt
    WHERE dt.branch_id = b.id
      AND dt.floor_id = 'FLOOR-2'
      AND dt.table_number = 'T03'
)
LIMIT 1;