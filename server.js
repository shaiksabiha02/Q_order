import http from "http";
import express from "express";
import dotenv from "dotenv";
import logger from "./src/config/logger.js";
import "./src/config/db.js";
import { createKdsSocket } from "./src/sockets/gateways/kds.socket.js";
import { createTableCartSocket } from "./src/sockets/gateways/tablecart.socket.js";
import { createOrderTrackingSocket } from "./src/sockets/gateways/ordertracking.socket.js";
import { createStaffAlertsSocket } from "./src/sockets/gateways/staffalerts.socket.js";
import { setupSwagger } from "./swagger.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
setupSwagger(app);
const server = http.createServer(app);

createKdsSocket(server);
createTableCartSocket(server);
reateOrderTrackingSocket(server);
createStaffAlertsSocket(server);

server.listen(PORT, () => {
    logger.info(`Q_Order WebSocket Server running on port ${PORT}`);

    logger.info("KDS WebSocket: /ws/v1/kds/stream");
    logger.info("Table Cart WebSocket: /ws/v1/table-cart");
    logger.info("Order Tracking WebSocket: /ws/v1/orders/track");
    logger.info("Staff Alerts WebSocket: /ws/v1/staff/alerts");
});

