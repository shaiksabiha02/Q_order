import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import logger from "./src/config/logger.js";
import errorMiddleware from "./src/middlewares/error.middleware.js";

import authRoutes from "./src/routes/auth.routes.js";
import tenantsRoutes from "./src/routes/tenants.routes.js";
import branchesRoutes from "./src/routes/branches.routes.js";
import paymentGatewaysRoutes from "./src/routes/payment_gateways.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());


app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});


app.use("/api/v1/superadmin/auth", authRoutes);
app.use("/api/v1/superadmin/tenants", tenantsRoutes);
app.use("/api/v1/superadmin", branchesRoutes);
app.use("/api/v1/superadmin", paymentGatewaysRoutes);
app.use("/api/v1/superadmin", analyticsRoutes);


app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);


app.get("/", (req, res) => {
    res.send("Q_Order SaaS API Running");
});


app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running on ${PORT}`);
});