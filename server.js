import express from "express";
import dotenv from "dotenv";

import "./src/config/db.js";

import authRoutes from "./src/routes/auth.routes.js";
import diningTablesRoutes from "./src/routes/diningTables.routes.js";
import restaurantRoutes from "./src/routes/restaurant.routes.js";

import { swaggerSpec, swaggerUi } from "./swagger.js";

import logger from "./src/config/logger.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/staff/tables", diningTablesRoutes);

app.use("/api/v1/restaurant", restaurantRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Q_Order API is running",
    });
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

export default app;

