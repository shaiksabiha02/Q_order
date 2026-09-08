CREATE TABLE IF NOT EXISTS kitchen_stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branch_id, name)
);

ALTER TABLE menu_items
ADD COLUMN IF NOT EXISTS station_id UUID
REFERENCES kitchen_stations(id)
ON DELETE SET NULL;

ALTER TABLE order_items
ADD COLUMN IF NOT EXISTS station_id UUID
REFERENCES kitchen_stations(id)
ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS kds_events (
    event_id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
    event_type VARCHAR(40) NOT NULL,
    payload JSONB DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS kds_print_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    printer_ip VARCHAR(45) NOT NULL,
    raw_bytes BYTEA,
    status VARCHAR(20) DEFAULT 'PENDING',
    attempts INT DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    printed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_order_items_station
ON order_items(station_id, status);

CREATE INDEX IF NOT EXISTS idx_kds_events
ON kds_events(branch_id, event_id);

CREATE INDEX IF NOT EXISTS idx_kds_print_jobs
ON kds_print_jobs(order_id, status);

ALTER TABLE kitchen_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE kds_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE kds_print_jobs ENABLE ROW LEVEL SECURITY;