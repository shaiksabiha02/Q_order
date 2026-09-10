import { WebSocketServer, WebSocket } from "ws";
import { updateItemStatus } from "../../services/kds.service.js";
import { orderEvents } from "../../events/order.event.js";
import logger from "../../config/logger.js";

export const createKdsSocket = (server) => {
    const wss = new WebSocketServer({
        server,
        path: "/ws/v1/kds/stream"
    });
    wss.on("connection", (ws, request) => {

        logger.info("KDS connected");


        // ==========================================
        // TEMPORARY TENANT / BRANCH
        // ==========================================
        //
        // IMPORTANT:
        // Replace these with values obtained
        // from your JWT/auth middleware.
        //
        // Do NOT keep fake values in final code.
        //

        const tenantId = "5d0d23e8-c515-43f2-a573-5dea641d5443";
        const branchId = "a7c93232-fe8a-46de-9f3d-9cc41547c335";
        ws.on("message", async (message) => {

            try {

                const data = JSON.parse(message);


                if (data.event === "ITEM_STATUS_CHANGED") {

                    const {
                        order_item_id,
                        new_status
                    } = data.data;

                    if (
                        !["PREPARING", "READY"].includes(new_status)
                    ) {

                        ws.send(
                            JSON.stringify({
                                event: "ERROR",
                                message: "Invalid item status"
                            })
                        );

                        return;
                    }


                    // ==========================================
                    // CALL EXISTING KDS SERVICE
                    // ==========================================

                    const result = await updateItemStatus(
                        tenantId,
                        branchId,
                        order_item_id,
                        new_status
                    );


                    // ==========================================
                    // SEND ACK TO KDS
                    // ==========================================

                    ws.send(
                        JSON.stringify({
                            event: "ITEM_STATUS_CHANGED_ACK",
                            data: result
                        })
                    );
                }

            } catch (error) {

                console.error(
                    "KDS message error:",
                    error
                );

                ws.send(
                    JSON.stringify({
                        event: "ERROR",
                        message: "Failed to process KDS message"
                    })
                );
            }
        });


        // ==========================================
        // SERVER -> KDS
        // NEW_ORDER_RECEIVED
        // ==========================================

        const sendNewOrder = (order) => {

            // ==========================================
            // TENANT / BRANCH FILTER
            // ==========================================

            if (
                order.tenant_id !== tenantId ||
                order.branch_id !== branchId
            ) {
                return;
            }


            // ==========================================
            // SEND TO KDS
            // ==========================================

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


        // Listen for new orders

        orderEvents.on(
            "NEW_ORDER_RECEIVED",
            sendNewOrder
        );


        // ==========================================
        // KDS DISCONNECTED
        // ==========================================

        ws.on("close", () => {

            // Remove event listener
            // to prevent memory leaks

            orderEvents.off(
                "NEW_ORDER_RECEIVED",
                sendNewOrder
            );

            console.log("KDS disconnected");
        });


        // ==========================================
        // WEBSOCKET ERROR
        // ==========================================

        ws.on("error", (error) => {

            console.error(
                "KDS WebSocket error:",
                error
            );
        });

    });


    console.log(
        "KDS WebSocket started: /ws/v1/kds/stream"
    );


    return wss;
};
