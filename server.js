import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import "./src/config/db.js";
import logger from './src/config/logger.js';

  
import authRoutes from "./src/routes/v1/auth.routes.js";
import tenantsRoutes from "./src/routes/v1/tenants.routes.js";
import branchesRoutes from "./src/routes/v1/branches.routes.js";
import paymentGatewaysRoutes from "./src/routes/v1/payment_gateways.routes.js";
import analyticsRoutes from "./src/routes/v1/analytics.routes.js";  
import menuCategoryRoutes from './src/routes/menu-category.routes.js';
import menuItemRoutes from './src/routes/menu-item.routes.js';
import modifierGroupRoutes from './src/routes/modifier-group.routes.js'; 
import modifierOptionRoutes from './src/routes/modifier-option.routes.js';  
import itemModifierGroupRoutes from './src/routes/item-modifier-group.routes.js'; 

import paymentRoutes from "./src/routes/payment.route.js";
import billingRoutes from "./src/routes/billing.route.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());

// Webhook route needs the raw request body for HMAC verification
app.use("/api/v1/payments/webhook",express.raw({ type: "application/json" }));

app.use(express.json());

app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

app.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
});


app.use("/api/v1/payments",paymentRoutes);
app.use("/api/v1/billing",billingRoutes);

app.use('/api/v1/menu', menuCategoryRoutes);
app.use('/api/v1', menuItemRoutes);
app.use('/api/v1', modifierGroupRoutes);
app.use('/api/v1', modifierOptionRoutes);
app.use('/api/v1', itemModifierGroupRoutes);
app.use("/api/v1/superadmin/auth", authRoutes);
app.use("/api/v1/superadmin/tenants", tenantsRoutes);
app.use("/api/v1/superadmin", branchesRoutes);
app.use("/api/v1/superadmin", paymentGatewaysRoutes);
app.use("/api/v1/superadmin", analyticsRoutes);
  
  
app.use(errorMiddleware);
app.get("/", (req, res) => {
    res.send("Q_Order SaaS API Running");
});

app.listen(3000,()=>{
    logger.info("Server running on port 3000");
    logger.info('Swagger running at http://localhost:3000/api/v1/docs')
});