import { WebSocketServer,WebSocket } from "ws";
import { cartEvents } from "../../events/cart.event.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";

const cartRooms = new Map();

export function createTableCartSocket(server){
    const wss = new WebSocketServer({
        server,
        path:"/ws/v1/table-cart"
    });
    wss.on("connection",async(ws,request)=>{
        // the authenticated 
        const authenticated = socketAuthMiddleware(ws,request);
        if(!authenticated){
            return;
        }
        const guestId = ws.guestId;
        console.log(`Guest${guestId} connected to table cart`);




        // =========================
        // GET CART
        // =========================

        /*
         * Get cart_id using guestId
         *
         * Example:
         *
         * const cartId = await getCartIdByGuestId(guestId);
         */

        const cartId = null;//temporaray 
        //const cartId = await getCartIdByGuestId(guestId);
        if(!cartId){
            console.log(`No active cart found for guests ${guestId}`);
            ws.close(1008,"Cart not found");
            return;
        }

        // joining cart room
        if(!cartRooms.has(cartId)){
            cartRooms.set(cartId,new Set());

        }
        cartRooms.get(cartId).add(ws);
        ws.cartId = cartId;
        console.log(`Gusts ${guestId} joined Cart ${cartId}`);
        // disconnecting

        ws.on("close",()=>{
            const room = cartRooms.get(cartId);
            if(room){
                room.delete(ws);
                if(room.size === 0){
                    cartRooms.delete(cartId);
                }
            }

            console.log(`Guests ${guestId} disconnected from Cart ${cartId}`);

        });
    });

    // cart is mutated

    cartEvents.on("CART_MUTATED",(cart)=>{
        const room = cartRooms.get(cart.cart_id);
        if(!room){
            return;
        }
        const message = JSON.stringify({
            event:"CART_MUTATED",
            data:{
                cart_id:cart.cart_id,
                updated_by_guest_id:cart.updated_by_guest_id,
                cart_items:cart.cart_items
            }
        });
        room.forEach((client)=>{
            if (client.readyState === WebSocket.OPEN){
                client.send(message);
            }
        });
    });
    return wss;
}