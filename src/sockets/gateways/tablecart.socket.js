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

    // Handle WebSocket upgrade
    server.on("upgrade", (request, socket, head) => {
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );

        // Only handle table-cart WebSocket
        if (url.pathname !== "/ws/v1/table-cart") {
            return;
        }

        logger.info("Table Cart WebSocket upgrade received");

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });

    // New WebSocket connection
    wss.on("connection", async (ws, request) => {
        try {
            // 1. Authenticate JWT
            const authenticated = socketAuthMiddleware(ws, request);

            if (!authenticated) {
                return;
            }

            // 2. Get information from JWT
            const {
                guest_id,
                tenant_id,
                branch_id
            } = ws.user;

            // 3. Validate required JWT claims
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

            // 4. Find the guest's active cart
            const cart = await getCartIdByGuestId(guest_id);

            const cartId = cart?.id;

            if (!cartId) {
                logger.info(
                    `No active cart found for guest ${guest_id}`
                );

                ws.close(1008, "Cart not found");
                return;
            }

            // 5. Create cart room if it doesn't exist
            if (!cartRooms.has(cartId)) {
                cartRooms.set(cartId, new Set());
            }

            // 6. Add guest's WebSocket connection to the cart room
            const room = cartRooms.get(cartId);

            room.add(ws);

            // 7. Store connection information
            ws.guestId = guest_id;
            ws.cartId = cartId;
            ws.tenantId = tenant_id;
            ws.branchId = branch_id;

            logger.info(
                `Guest ${guest_id} joined Cart ${cartId}`
            );

            // 8. Handle disconnect
            ws.on("close", () => {
                const room = cartRooms.get(cartId);

                if (room) {
                    room.delete(ws);

                    // Remove empty room
                    if (room.size === 0) {
                        cartRooms.delete(cartId);
                    }
                }

                logger.info(
                    `Guest ${guest_id} disconnected from Cart ${cartId}`
                );
            });

            // 9. Handle socket errors
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

    // Listen for cart changes from Cart Service
    cartEvents.on("CART_MUTATED", (cart) => {
        const room = cartRooms.get(cart.cart_id);

        // Nobody connected to this cart
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

        // Send update to every guest in this cart
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