import { WebSocketServer, WebSocket } from "ws";
import { orderEvents } from "../../events/order.event.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";
import logger from "../../config/logger.js";
export const createOrderTrackingSocket = (server) => {

    const wss = new WebSocketServer({
        noServer: true
    });
    server.on("upgrade", (request, socket, head) => {

        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );
        if (url.pathname !== "/ws/v1/orders/track") {
            return;
        }

        logger.info(
            "ORDER TRACKING WebSocket upgrade received"
        );
        wss.handleUpgrade(
            request,
            socket,
            head,
            (ws) => {
                wss.emit("connection", ws, request);
            }
        );
    });
      wss.on("connection", (ws, request) => {
         logger.info(
            "ORDER TRACKING CONNECTION RECEIVED"
        );
        const authenticated = socketAuthMiddleware(
             ws,
            request
        );

        if (!authenticated) {
            return;
        }
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        const orderId = url.searchParams.get("order_id");
        if (!orderId) {

            ws.close(
                1008,
                "order_id required"
            );

            return;
        }
        ws.orderId = orderId;

        logger.info(
            `Guest connected to order tracking: ${orderId}`
        );
        ws.on("close", () => {

            logger.info(
                `Guest disconnected from order tracking: ${orderId}`
            );
        });
        ws.on("error", (error) => {

            logger.error(
                `Order tracking WebSocket error: ${error.message}`
            );
        });
    });
    orderEvents.on(
        "ORDER_STATUS_UPDATED",
        (order) => {

            logger.info(
                "Order status updated:",
                order
            );
            const allowedStatuses = [
                "PREPARING",
                "READY",
                "SERVED"
            ];

            if (!allowedStatuses.includes(order.status)) {
                return;
            }
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
    logger.info(
        "Order tracking WebSocket started: /ws/v1/orders/track"
    );

    return wss;
};




