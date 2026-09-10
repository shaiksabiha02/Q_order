import "dotenv/config";

import express from "express";

import pool from "./src/config/db.js";
import logger from "./src/config/logger.js";

import kdsRoutes from "./src/routes/kds.routes.js";
import orderRoutes from "./src/routes/order.routes.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/v1/kds", kdsRoutes);
app.use("/api/v1/orders", orderRoutes);

pool
  .query("SELECT 1")
  .then(() => {
    logger.info("PostgreSQL connected successfully");
  })
  .catch((error) => {
    logger.error(`PostgreSQL connection failed: ${error.message}`);
  });

app.use(errorMiddleware);

app.listen(3000, () => {
  logger.info("Server running on port 3000");
});