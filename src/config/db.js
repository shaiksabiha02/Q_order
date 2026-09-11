import pg from "pg";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

pool.query("SELECT 1")
    .then(() => {
        logger.info("PostgreSQL connected successfully");
    })
    .catch((error) => {
        logger.error({
            message: "PostgreSQL connection failed",
            error: error.message
        });
    });

export default pool;