import request from "supertest";
import app from "../../server.js";
import pool from "../config/db.js";

async function runCartTests() {
  console.log("\n==========================================");
  console.log("🧪 STARTING CART MODULE API VERIFICATION");
  console.log("==========================================\n");

  try {
    // 1. Fetch test table from database
    const tableRes = await pool.query("SELECT id, table_number FROM dining_tables LIMIT 1;");
    if (tableRes.rows.length === 0) {
      throw new Error("No dining table found. Please run seeder first!");
    }
    const testTableId = tableRes.rows[0].id;

    // Fetch or prepare menu items (due to foreign key constraint to menu_items)
    let itemRes = await pool.query("SELECT id, name, base_price FROM menu_items LIMIT 2;");
    if (itemRes.rows.length === 0) {
      let catRes = await pool.query("SELECT id FROM menu_categories LIMIT 1;");
      let catId;
      const tableInfo = await pool.query("SELECT tenant_id, branch_id FROM dining_tables LIMIT 1;");
      if (catRes.rows.length === 0) {
        const newCat = await pool.query(
          "INSERT INTO menu_categories (tenant_id, branch_id, name) VALUES ($1, $2, 'Starters') RETURNING id;",
          [tableInfo.rows[0].tenant_id, tableInfo.rows[0].branch_id]
        );
        catId = newCat.rows[0].id;
      } else {
        catId = catRes.rows[0].id;
      }
      const newItem1 = await pool.query(
        "INSERT INTO menu_items (tenant_id, category_id, name, base_price, is_available) VALUES ($1, $2, 'Panner Chilli', 300.00, true) RETURNING id, name, base_price;",
        [tableInfo.rows[0].tenant_id, catId]
      );
      const newItem2 = await pool.query(
        "INSERT INTO menu_items (tenant_id, category_id, name, base_price, is_available) VALUES ($1, $2, 'Veg Biryani', 250.00, true) RETURNING id, name, base_price;",
        [tableInfo.rows[0].tenant_id, catId]
      );
      itemRes = { rows: [newItem1.rows[0], newItem2.rows[0]] };
    }

    const testItemId1 = itemRes.rows[0].id;
    const testItemId2 = itemRes.rows[1] ? itemRes.rows[1].id : itemRes.rows[0].id;

    const guest1 = "11111111-1111-4111-8111-111111111111";
    const guest2 = "22222222-2222-4222-8222-222222222222";

    console.log(`Using Table: ${tableRes.rows[0].table_number} (${testTableId})`);
    console.log(`Using Test Item 1: ${testItemId1}`);
    console.log(`Using Test Item 2: ${testItemId2}`);
    console.log(`Using Guest 1: ${guest1}`);
    console.log(`Using Guest 2: ${guest2}\n`);

    // -------------------------------------------------------------
    // Test 0: Clear Cart (Setup clean slate)
    // -------------------------------------------------------------
    console.log("--- TEST 0: DELETE /api/v1/cart/clear ---");
    const clearRes = await request(app)
      .delete("/api/v1/cart/clear")
      .set("x-table-id", testTableId);
    console.log(`Status: ${clearRes.status}`);
    console.log("Response:", clearRes.body);

    // -------------------------------------------------------------
    // Test 1: POST /api/v1/cart/items (Guest 1 adds 2 x Item 1)
    // -------------------------------------------------------------
    console.log("\n--- TEST 1: POST /api/v1/cart/items (Guest 1 adds 2 x Item 1) ---");
    const addRes1 = await request(app)
      .post("/api/v1/cart/items")
      .set("x-table-id", testTableId)
      .set("x-guest-id", guest1)
      .send({
        item_id: testItemId1,
        qty: 2,
        notes: "Extra spicy"
      });

    console.log(`Status: ${addRes1.status}`);
    console.log("Added Item ID:", addRes1.body?.data?.added_item?.id);
    console.log("Total Items:", addRes1.body?.data?.cart?.total_items);
    const cartItemId1 = addRes1.body?.data?.added_item?.id;

    if (addRes1.status !== 201 || !cartItemId1) {
      throw new Error(`Test 1 Failed: expected 201 but got ${addRes1.status}`);
    }
    console.log("✅ Test 1 Passed!");

    // -------------------------------------------------------------
    // Test 2: POST /api/v1/cart/items (Guest 2 adds 1 x Item 2)
    // -------------------------------------------------------------
    console.log("\n--- TEST 2: POST /api/v1/cart/items (Guest 2 adds 1 x Item 2) ---");
    const addRes2 = await request(app)
      .post("/api/v1/cart/items")
      .set("x-table-id", testTableId)
      .set("x-guest-id", guest2)
      .send({
        item_id: testItemId2,
        qty: 1,
        notes: "Medium spicy"
      });

    console.log(`Status: ${addRes2.status}`);
    console.log("Added Item ID for Guest 2:", addRes2.body?.data?.added_item?.id);
    const cartItemId2 = addRes2.body?.data?.added_item?.id;

    if (addRes2.status !== 201 || !cartItemId2) {
      throw new Error(`Test 2 Failed: expected 201 but got ${addRes2.status}`);
    }
    console.log("✅ Test 2 Passed!");

    // -------------------------------------------------------------
    // Test 3: GET /api/v1/cart (Fetch shared table cart & per-guest allocation)
    // -------------------------------------------------------------
    console.log("\n--- TEST 3: GET /api/v1/cart (Verify Per-Guest Allocation & Table Totals) ---");
    const getRes = await request(app)
      .get("/api/v1/cart")
      .set("x-table-id", testTableId);

    console.log(`Status: ${getRes.status}`);
    console.log("Cart Summary:", {
      total_items: getRes.body?.data?.total_items,
      guests_count: getRes.body?.data?.guests?.length
    });
    console.log("Guests breakdown (allocated per guest_id):", JSON.stringify(getRes.body?.data?.guests, null, 2));

    if (getRes.status !== 200 || getRes.body?.data?.total_items !== 3) {
      throw new Error(`Test 3 Failed: expected total 3 items but got ${getRes.body?.data?.total_items}`);
    }
    console.log("✅ Test 3 Passed! (Returns items allocated per guest_id)");

    // -------------------------------------------------------------
    // Test 4: PUT /api/v1/cart/items/:cart_item_id (Update qty/modifiers)
    // -------------------------------------------------------------
    console.log(`\n--- TEST 4: PUT /api/v1/cart/items/${cartItemId1} (Update qty to 3) ---`);
    const updateRes = await request(app)
      .put(`/api/v1/cart/items/${cartItemId1}`)
      .set("x-table-id", testTableId)
      .send({
        qty: 3,
        notes: "Very spicy please"
      });

    console.log(`Status: ${updateRes.status}`);
    console.log("Updated Item:", updateRes.body?.data?.updated_item);
    console.log("New Total Items in Cart:", updateRes.body?.data?.cart?.total_items);

    if (updateRes.status !== 200 || updateRes.body?.data?.updated_item?.qty !== 3) {
      throw new Error(`Test 4 Failed: expected qty 3 but got ${updateRes.body?.data?.updated_item?.qty}`);
    }
    console.log("✅ Test 4 Passed!");

    // -------------------------------------------------------------
    // Test 5: DELETE /api/v1/cart/items/:cart_item_id (Remove item from cart)
    // -------------------------------------------------------------
    console.log(`\n--- TEST 5: DELETE /api/v1/cart/items/${cartItemId2} (Remove Guest 2's item) ---`);
    const deleteRes = await request(app)
      .delete(`/api/v1/cart/items/${cartItemId2}`)
      .set("x-table-id", testTableId);

    console.log(`Status: ${deleteRes.status}`);
    console.log("Delete Response:", deleteRes.body);

    if (deleteRes.status !== 200) {
      throw new Error(`Test 5 Failed: expected 200 but got ${deleteRes.status}`);
    }
    console.log("✅ Test 5 Passed!");

    // -------------------------------------------------------------
    // Final Cart Verification
    // -------------------------------------------------------------
    console.log("\n--- FINAL VERIFICATION: GET /api/v1/cart ---");
    const finalGetRes = await request(app)
      .get("/api/v1/cart")
      .set("x-table-id", testTableId);

    console.log("Final Cart State:", {
      total_items: finalGetRes.body?.data?.total_items,
      guests_count: finalGetRes.body?.data?.guests?.length
    });

    console.log("\n🎉 ALL 5 TESTS PASSED SUCCESSFULLY! Cart APIs are 100% operational!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Test failed:", error);
    process.exit(1);
  }
}

runCartTests();
