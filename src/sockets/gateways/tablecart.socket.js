import { WebSocketServer, WebSocket } from "ws";
import { cartEvents } from "../../events/cart.event.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";
import { getCartIdByGuestId } from "../../services/cart.service.js";
import logger from "../../config/logger.js";

const cartRooms = new Map();

export function createTableCartSocket(server) {
    const wss = new WebSocketServer({
        noServer: true
    });

    server.on("upgrade", (request, socket, head) => {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );
        if (url.pathname !== "/ws/v1/table-cart") {
            return;
        }

        logger.info("Table Cart WebSocket upgrade received");

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });
    wss.on("connection", async (ws, request) => {
        try {
            // 1. Authenticate JWT
            const authenticated = socketAuthMiddleware(ws, request);

            if (!authenticated) {
                return;
            }
            const {
                guest_id,
                tenant_id,
                branch_id
            } = ws.user;
            if (!guest_id || !tenant_id || !branch_id) {
                logger.error(
                    "Table Cart WebSocket: required JWT claims are missing"
                );

                ws.close(1008, "Invalid authentication claims");
                return;
            }

            logger.info(
                `Guest ${guest_id} connected to Table Cart WebSocket`
            );
            const cart = await getCartIdByGuestId(guest_id);

            const cartId = cart?.id;

            if (!cartId) {
                logger.info(
                    `No active cart found for guest ${guest_id}`
                );

                ws.close(1008, "Cart not found");
                return;
            }
            if (!cartRooms.has(cartId)) {
                cartRooms.set(cartId, new Set());
            }
            const room = cartRooms.get(cartId);

            room.add(ws);
            ws.guestId = guest_id;
            ws.cartId = cartId;
            ws.tenantId = tenant_id;
            ws.branchId = branch_id;

            logger.info(
                `Guest ${guest_id} joined Cart ${cartId}`
            );
            ws.on("close", () => {
                const room = cartRooms.get(cartId);

                if (room) {
                    room.delete(ws);
                    if (room.size === 0) {
                        cartRooms.delete(cartId);
                    }
                }

                logger.info(
                    `Guest ${guest_id} disconnected from Cart ${cartId}`
                );
            });
            ws.on("error", (error) => {
                logger.error(
                    `Table Cart WebSocket error: ${error.message}`
                );
            });

        } catch (error) {
            logger.error(
                `Table Cart WebSocket connection error: ${error.message}`
            );

            ws.close(1011, "Internal server error");
        }
    });
    cartEvents.on("CART_MUTATED", (cart) => {
        const room = cartRooms.get(cart.cart_id);
        if (!room) {
            return;
        }

        const message = JSON.stringify({
            event: "CART_MUTATED",
            data: {
                cart_id: cart.cart_id,
                updated_by_guest_id: cart.updated_by_guest_id,
                cart_items: cart.cart_items
            }
        });
        room.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    logger.info(
        "Table Cart WebSocket started: /ws/v1/table-cart"
    );

    return wss;
}