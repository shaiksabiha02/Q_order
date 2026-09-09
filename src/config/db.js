import pg from "pg";
import dotenv from "dotenv";
import logger from "./logger.js";
import pool from "../config/db.js";

dotenv.config();
const {Pool} = pg;
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export default pool;