
import { WebSocketServer, WebSocket } from "ws";

import { orderEvents } from "../../events/order.event.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";
import logger from "../../config/logger.js";

export const createOrderTrackingSocket = (server) => {

    // Create WebSocket server without automatically
    // attaching it to the HTTP server
    const wss = new WebSocketServer({
        noServer: true
    });

    // =====================================================
    // ORDER TRACKING WEBSOCKET UPGRADE
    // =====================================================

    server.on("upgrade", (request, socket, head) => {

        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        // Ignore other WebSocket paths
        if (url.pathname !== "/ws/v1/orders/track") {
            return;
        }

        logger.info(
            "ORDER TRACKING WebSocket upgrade received"
        );

        // Upgrade HTTP connection to WebSocket
        wss.handleUpgrade(
            request,
            socket,
            head,
            (ws) => {
                wss.emit("connection", ws, request);
            }
        );
    });

    // =====================================================
    // CLIENT CONNECTION
    // =====================================================

    wss.on("connection", (ws, request) => {

        logger.info(
            "ORDER TRACKING CONNECTION RECEIVED"
        );

        // -------------------------------------------------
        // 1. Authenticate using JWT
        // -------------------------------------------------

        const authenticated = socketAuthMiddleware(
            ws,
            request
        );

        if (!authenticated) {
            return;
        }

        // -------------------------------------------------
        // 2. Read order_id from WebSocket URL
        // -------------------------------------------------

        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        const orderId = url.searchParams.get("order_id");

        // order_id is required
        if (!orderId) {

            ws.close(
                1008,
                "order_id required"
            );

            return;
        }

        // -------------------------------------------------
        // 3. Store which order this client is tracking
        // -------------------------------------------------

        ws.orderId = orderId;

        logger.info(
            `Guest connected to order tracking: ${orderId}`
        );

        // -------------------------------------------------
        // 4. Client disconnected
        // -------------------------------------------------

        ws.on("close", () => {

            logger.info(
                `Guest disconnected from order tracking: ${orderId}`
            );
        });

        // -------------------------------------------------
        // 5. WebSocket error
        // -------------------------------------------------

        ws.on("error", (error) => {

            logger.error(
                `Order tracking WebSocket error: ${error.message}`
            );
        });
    });

    // =====================================================
    // ORDER STATUS UPDATED EVENT
    // =====================================================

    orderEvents.on(
        "ORDER_STATUS_UPDATED",
        (order) => {

            logger.info(
                "Order status updated:",
                order
            );

            // Only send these statuses to Guest UI
            const allowedStatuses = [
                "PREPARING",
                "READY",
                "SERVED"
            ];

            // Ignore other order statuses
            if (!allowedStatuses.includes(order.status)) {
                return;
            }

            // -------------------------------------------------
            // Send update only to clients tracking this order
            // -------------------------------------------------

            wss.clients.forEach((client) => {

                if (
                    client.readyState === WebSocket.OPEN &&
                    client.orderId === String(order.order_id)
                ) {

                    client.send(
                        JSON.stringify({
                            event: "ORDER_STATUS_UPDATED",

                            data: {
                                order_id: order.order_id,
                                status: order.status,
                                timestamp: order.timestamp
                            }
                        })
                    );
                }
            });
        }
    );

    // =====================================================
    // SERVER START MESSAGE
    // =====================================================

    logger.info(
        "Order tracking WebSocket started: /ws/v1/orders/track"
    );

    return wss;
};




