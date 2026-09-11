import { pool } from "../config/db.js";

import { up as createKitchenStations }
  from "./kitchenstation.migration.js";

import { up as createMenuItemStations }
  from "./menuitemstation.migration.js";

import { up as createItemModifiers }
  from "./itemmodifier.migration.js";

import { up as createKdsEvents }
  from "./kdsevent.migration.js";

import { up as createKdsPrintJobs }
  from "./kdsprintjob.migration.js";

const migrations = [
  createKitchenStations,
  createMenuItemStations,
  createItemModifiers,
  createKdsEvents,
  createKdsPrintJobs
];

async function runKdsMigrations() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    for (const migration of migrations) {
      await migration(client);
    }

    await client.query("COMMIT");

    logger.info("KDS migrations completed successfully");
  } catch (error) {
    await client.query("ROLLBACK");

    logger.error(`KDS migration failed: ${error.message}`);
    process.exitCode = 1;
  } finally {
    client.release();
  }
}

runKdsMigrations();