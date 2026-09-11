import { WebSocketServer, WebSocket } from "ws";

import { updateItemStatus } from "../../services/kds.service.js";
import { orderEvents } from "../../events/order.event.js";
import logger from "../../config/logger.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";

export const createKdsSocket = (server) => {

    const wss = new WebSocketServer({
        noServer: true
    });

 server.on("upgrade", (request, socket, head) => {

        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        if (url.pathname !== "/ws/v1/kds/stream") {
            return;
        }

        logger.info("KDS WebSocket upgrade received");

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });

    

    wss.on("connection", (ws, request) => {

        const authenticated = socketAuthMiddleware(ws, request);

        if (!authenticated) {
            return;
        }

        const {
            guest_id,
            tenant_id,
            branch_id,
            role
        } = ws.user;

        if (!guest_id || !tenant_id || !branch_id) {

            ws.close(
                1008,
                "Invalid authentication claims"
            );

            return;
        }

        logger.info(
            `KDS authenticated - guest: ${guest_id}, tenant: ${tenant_id}, branch: ${branch_id}, role: ${role}`
        );

       

        ws.on("message", async (message) => {

            try {

                const data = JSON.parse(
                    message.toString()
                );

                if (data.event !== "ITEM_STATUS_CHANGED") {

                    ws.send(
                        JSON.stringify({
                            event: "ERROR",
                            message: "Unknown event"
                        })
                    );

                    return;
                }

                const {
                    order_item_id,
                    new_status
                } = data.data || {};

                if (!order_item_id || !new_status) {

                    ws.send(
                        JSON.stringify({
                            event: "ERROR",
                            message:
                                "order_item_id and new_status are required"
                        })
                    );

                    return;
                }

                if (
                    !["PREPARING", "READY"].includes(
                        new_status
                    )
                ) {

                    ws.send(
                        JSON.stringify({
                            event: "ERROR",
                            message: "Invalid item status"
                        })
                    );

                    return;
                }

                // Update through KDS service
                const result = await updateItemStatus(
                    tenant_id,
                    branch_id,
                    order_item_id,
                    new_status
                );

                if (!result) {

                    ws.send(
                        JSON.stringify({
                            event: "ERROR",
                            message:
                                "Order item not found or does not belong to this branch"
                        })
                    );

                    return;
                }

                ws.send(
                    JSON.stringify({
                        event: "ITEM_STATUS_CHANGED_ACK",
                        data: result
                    })
                );

            } catch (error) {

                logger.error(
                    `KDS message error: ${error.message}`
                );

                ws.send(
                    JSON.stringify({
                        event: "ERROR",
                        message:
                            "Failed to process KDS message"
                    })
                );
            }
        });
        const sendNewOrder = (order) => {

            if (
                order.tenant_id !== tenant_id ||
                order.branch_id !== branch_id
            ) {
                return;
            }

            if (ws.readyState === WebSocket.OPEN) {

                ws.send(
                    JSON.stringify({
                        event: "NEW_ORDER_RECEIVED",
                        data: {
                            order_id: order.order_id,
                            table_name: order.table_name,
                            items: order.items
                        }
                    })
                );
            }
        };

        orderEvents.on(
            "NEW_ORDER_RECEIVED",
            sendNewOrder
        );
        ws.on("close", () => {

            orderEvents.off(
                "NEW_ORDER_RECEIVED",
                sendNewOrder
            );

            logger.info(
                `KDS disconnected - guest: ${guest_id}`
            );
        });
        ws.on("error", (error) => {

            logger.error(
                `KDS WebSocket error: ${error.message}`
            );
        });
    });

    logger.info(
        "KDS WebSocket started: /ws/v1/kds/stream"
    );

    return wss;
};