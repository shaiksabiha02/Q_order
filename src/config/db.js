import pg from "pg";
import dotenv from "dotenv";
import logger from "../config/logger.js";

dotenv.config();
const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => {
    logger.info("Connected to PostgreSQL Database");
  })
  .catch((err) => {
    logger.error("Database Connection Error:", err.message);
  });
export default pool;