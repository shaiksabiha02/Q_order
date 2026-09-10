import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

import "./src/config/db.js";
import logger from "./src/config/logger.js";

import assistanceRoutes from "./src/routes/assistance.routes.js";
import { errorMiddleware } from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api/v1", assistanceRoutes);

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});