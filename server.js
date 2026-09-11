import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";

import logger from "./src/config/logger.js";
import pool from "./src/config/db.js";

import receiptRoutes from "./src/routes/receipt.routes.js";
import feedbackRoutes from "./src/routes/feedback.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/receipts", receiptRoutes);
app.use("/api/v1/feedback", feedbackRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await pool.query("SELECT 1");

        logger.info("Database connected successfully");

        app.listen(PORT, () => {
            logger.info("Server started", {
                port: PORT
            });
        });
    } catch (error) {
        logger.error("Database connection failed", {
            message: error.message,
            stack: error.stack
        });

        process.exit(1);
    }
};

startServer();

