import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import swaggerDocument from "./swagger-output.json" with { type: "json" };
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

import "./src/config/db.js";
import logger from "./src/config/logger.js";

import authRoutes from "./src/routes/auth.routes.js";
import tenantsRoutes from "./src/routes/tenants.routes.js";
import branchesRoutes from "./src/routes/branches.routes.js";
import paymentGatewaysRoutes from "./src/routes/payment_gateways.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";


import menuCategoryRoutes from "./src/routes/menu-category.routes.js";
import menuItemRoutes from "./src/routes/menu-item.routes.js";
import modifierGroupRoutes from "./src/routes/modifier-group.routes.js";
import modifierOptionRoutes from "./src/routes/modifier-option.routes.js";
import itemModifierGroupRoutes from "./src/routes/item-modifier-group.routes.js";

import logger from './src/config/logger.js';
import cartRouter from "./src/routes/cart.routes.js";
import receiptRoutes from "./src/routes/receipt.routes.js";
import feedbackRoutes from "./src/routes/feedback.routes.js";

  
import menuCategoryRoutes from './src/routes/menu-category.routes.js';
import menuItemRoutes from './src/routes/menu-item.routes.js';
import modifierGroupRoutes from './src/routes/modifier-group.routes.js'; 
import modifierOptionRoutes from './src/routes/modifier-option.routes.js';  
import itemModifierGroupRoutes from './src/routes/item-modifier-group.routes.js'; 
import kdsRoutes from "./src/routes/kds.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import diningTablesRoutes from "./src/routes/diningTables.routes.js";
import restaurantRoutes from "./src/routes/restaurant.routes.js";

import orderRoutes from "./src/routes/order.routes.js";
import assistanceRoutes from "./src/routes/assistance.routes.js";

import { createKdsSocket } from "./src/sockets/gateways/kds.socket.js";
import { createTableCartSocket } from "./src/sockets/gateways/tablecart.socket.js";
import { createOrderTrackingSocket } from "./src/sockets/gateways/ordertracking.socket.js";
import { createStaffAlertsSocket } from "./src/sockets/gateways/staffalerts.socket.js";
import paymentRoutes from "./src/routes/payment.route.js";
import billingRoutes from "./src/routes/billing.route.js";

import errorMiddleware from "./src/middlewares/error.middleware.js";

app.use(cors());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));
setupSwagger(app);


app.use(
    "/api/v1/payments/webhook",
    express.raw({ type: "application/json" })
);

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

app.get("/", (req, res) => {
    res.json({
        project: "Q_Order API",
        module: "Module 5: Cart & Shared Table Synchronization",
        status: "online",
        docs: "/api-docs",
        endpoints: {
            getCart: "GET /api/v1/cart",
            addItem: "POST /api/v1/cart/items",
            updateItem: "PUT /api/v1/cart/items/:cart_item_id",
            removeItem: "DELETE /api/v1/cart/items/:cart_item_id",
            clearCart: "DELETE /api/v1/cart/clear"
        }
    });
});



app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/billing", billingRoutes);


app.use("/api/v1/menu", menuCategoryRoutes);
app.use("/api/v1", menuItemRoutes);
app.use("/api/v1", modifierGroupRoutes);
app.use("/api/v1", modifierOptionRoutes);
app.use("/api/v1", itemModifierGroupRoutes);

app.use("/api/v1/receipts", receiptRoutes);
app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/payments",paymentRoutes);
app.use("/api/v1/billing",billingRoutes);

app.use("/api/v1/superadmin/auth", authRoutes);
app.use("/api/v1/superadmin/tenants", tenantsRoutes);
app.use("/api/v1/superadmin", branchesRoutes);
app.use("/api/v1/superadmin", paymentGatewaysRoutes);
app.use("/api/v1/superadmin", analyticsRoutes);

app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/kds", kdsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/staff/tables", diningTablesRoutes);
app.use("/api/v1/restaurant", restaurantRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use("/api/v1", assistanceRoutes);
app.use(errorHandler);

app.use(errorMiddleware);
app.get("/", (req, res) => {
    res.send("Q_Order SaaS API Running");
});


app.use(errorMiddleware);

app.listen(3000, () => {
    logger.info("Server running on port 3000");

    logger.info('Swagger running at http://localhost:3000/api/v1/docs')
});
createKdsSocket(server);
createTableCartSocket(server);
createOrderTrackingSocket(server);
createStaffAlertsSocket(server);
export default app;

