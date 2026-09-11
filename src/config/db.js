import pg from "pg";
import dotenv from "dotenv";

import logger from "./logger.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query("SELECT 1")
  .then(() => logger.info("PostgreSQL connected successfully"));

export default pool;