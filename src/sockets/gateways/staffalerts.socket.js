import { WebSocketServer, WebSocket } from "ws";
import { assistanceEvents } from "../../events/assistance.event.js";
import logger from "../../config/logger.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";
export const createStaffAlertsSocket = (server) => {
    const wss = new WebSocketServer({
        noServer: true
    });
    server.on("upgrade", (request, socket, head) => {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );
        if (url.pathname !== "/ws/v1/staff/alerts") {
            return;
        }
        logger.info(
            "Staff Alerts WebSocket upgrade received"
        );
        wss.handleUpgrade(
            request,
            socket,
            head,
            (ws) => {
                wss.emit(
                    "connection",
                    ws,
                    request
                );
            }
        );
    });
    wss.on("connection", (ws, request) => {
        const authenticated = socketAuthMiddleware(
            ws,
            request
        );
        if (!authenticated) {
            return;
        }
        const {
            guest_id,
            tenant_id,
            branch_id,
            role
        } = ws.user;
        if (
            !guest_id ||
            !tenant_id ||
            !branch_id
        ) {
            ws.close(
                1008,
                "Invalid authentication claims"
            );
            return;
        }
        logger.info(
            `Staff Alerts authenticated - guest: ${guest_id}, tenant: ${tenant_id}, branch: ${branch_id}, role: ${role}`
        );
        const sendServiceRequested = (requestData) => {
            if (
                requestData.tenant_id !== tenant_id ||
                requestData.branch_id !== branch_id
            ) {
                return;
            }
            if (
                ws.readyState === WebSocket.OPEN
            ) {
            ws.send(
                    JSON.stringify({
                        event: "SERVICE_REQUESTED",
                        data: {
                            table_id: requestData.table_id,
                            request_type:
                                requestData.request_type
                        }
                    })
                );
            }
        };
        assistanceEvents.on(
            "SERVICE_REQUESTED",
            sendServiceRequested
        );
        ws.on("close", () => {
            assistanceEvents.off(
                "SERVICE_REQUESTED",
                sendServiceRequested
            );
           logger.info(
                `Staff Alerts disconnected - guest: ${guest_id}`
            );
        });
        ws.on("error", (error) => {
            logger.error(
                `Staff Alerts WebSocket error: ${error.message}`
            );
        });
    });
     logger.info(
        "Staff Alerts WebSocket started: /ws/v1/staff/alerts"
    );
return wss;
};