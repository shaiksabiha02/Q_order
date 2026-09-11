import pg from "pg";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

pool.on("error", (err) => {
    logger.error("PostgreSQL Pool Error", {
        message: err.message,
        stack: err.stack
    });
});

export default pool;

