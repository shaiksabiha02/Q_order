import pool from "../config/db.js";

export const seedCartData = async () => {
  try {
    console.log("🌱 Seeding initial data for Cart Module...");

    // 1. Ensure a Tenant exists
    let tenantRes = await pool.query(`SELECT id, company_name FROM tenants LIMIT 1;`);
    let tenantId;
    if (tenantRes.rows.length === 0) {
      const newTenant = await pool.query(`
        INSERT INTO tenants (company_name, tax_identifier, status)
        VALUES ('Spice Delight Restaurant', 'TAX-IN-987654', 'ACTIVE')
        RETURNING id, company_name;
      `);
      tenantId = newTenant.rows[0].id;
      console.log(` Created Tenant: ${newTenant.rows[0].company_name} (${tenantId})`);
    } else {
      tenantId = tenantRes.rows[0].id;
      console.log(` Using existing Tenant: ${tenantRes.rows[0].company_name} (${tenantId})`);
    }

    // 2. Ensure a Branch exists
    let branchRes = await pool.query(`SELECT id, name FROM branches WHERE tenant_id = $1 LIMIT 1;`, [tenantId]);
    let branchId;
    if (branchRes.rows.length === 0) {
      const newBranch = await pool.query(`
        INSERT INTO branches (tenant_id, name, address, timezone, currency, tax_rate)
        VALUES ($1, 'Banjara Hills Branch', 'Road No. 12, Banjara Hills, Hyderabad', 'Asia/Kolkata', 'INR', 5.00)
        RETURNING id, name;
      `, [tenantId]);
      branchId = newBranch.rows[0].id;
      console.log(` Created Branch: ${newBranch.rows[0].name} (${branchId})`);
    } else {
      branchId = branchRes.rows[0].id;
      console.log(` Using existing Branch: ${branchRes.rows[0].name} (${branchId})`);
    }

    // 3. Ensure a Dining Table exists
    let tableRes = await pool.query(`SELECT id, table_number FROM dining_tables WHERE branch_id = $1 LIMIT 1;`, [branchId]);
    let tableId;
    if (tableRes.rows.length === 0) {
      const newTable = await pool.query(`
        INSERT INTO dining_tables (tenant_id, branch_id, floor_id, table_number, capacity, qr_secret_token, status)
        VALUES ($1, $2, 'GROUND_FLOOR', 'T-01', 4, 'qr_secret_t01_token', 'OCCUPIED')
        RETURNING id, table_number;
      `, [tenantId, branchId]);
      tableId = newTable.rows[0].id;
      console.log(` Created Dining Table: ${newTable.rows[0].table_number} (${tableId})`);
    } else {
      tableId = tableRes.rows[0].id;
      console.log(` Using existing Dining Table: ${tableRes.rows[0].table_number} (${tableId})`);
    }

    console.log("\n==========================================");
    console.log(" Cart Test Environment Ready!");
    console.log("------------------------------------------");
    console.log(`Tenant ID:   ${tenantId}`);
    console.log(`Branch ID:   ${branchId}`);
    console.log(`Table ID:    ${tableId}`);
    console.log("==========================================\n");

    return { tenantId, branchId, tableId };
  } catch (error) {
    console.error("❌ Error seeding cart data:", error);
    throw error;
  }
};

// Auto-run if executed directly
if (process.argv[1]?.endsWith("cart.seeder.js")) {
  seedCartData().then(async () => {
    await pool.end();
  }).catch(async (e) => {
    console.error(e);
    await pool.end();
    process.exit(1);
  });
}
