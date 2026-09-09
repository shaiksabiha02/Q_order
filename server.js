import express from "express";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import logger from "./src/config/logger.js";
import kdsRoutes from "./src/routes/kds.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/kds", kdsRoutes);

pool.query("SELECT 1")
  .then(() => {
    logger.info("PostgreSQL connected successfully");
  })
  .catch((error) => {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
  });

app.listen(3000, () => {
  logger.info("Server running on port 3000");
});