import { WebSocketServer,WebSocket } from "ws";
import { cartEvents } from "../../events/cart.event.js";
import { socketAuthMiddleware } from "../socket.auth.middleware.js";
import { getCartIdByGuestId } from "../../services/cart.service.js";
import logger from "../../config/logger.js";
const cartRooms = new Map();

export function createTableCartSocket(server){

    const wss = new WebSocketServer({
        noServer:true
    });
    /*server.on("upgrade",(request,socket,head)=>{
        const url = new URL(
            request.url,
            `http://${request.headers.host}`
        );
        if (url.pathname!=="/ws/v1/table-cart"){
            return;
        }
        wss.handleUpgrade(request,socket,head,(ws)=>{
            wss.emit("connection",ws,request);
        });
    });*/
server.on("upgrade", (request, socket, head) => {

    console.log("WEBSOCKET UPGRADE RECEIVED");
    console.log("Request URL:", request.url);

    const url = new URL(
        request.url,
        `http://${request.headers.host}`
    );

    console.log("WebSocket path:", url.pathname);

    if (url.pathname !== "/ws/v1/table-cart") {
        console.log(" WebSocket path does not match");
        return;
    }

    console.log("WebSocket path matched");

    wss.handleUpgrade(request, socket, head, (ws) => {

        console.log("WebSocket upgrade successful");

        wss.emit("connection", ws, request);
    });
});






    wss.on("connection",async(ws,request)=>{
        // the authenticated 
        const authenticated = socketAuthMiddleware(ws,request);
        if(!authenticated){
            return;
        }
        const guestId = ws.guestId;
        logger.info(`Guest${guestId} connected to table cart`);
        
        const cart = await getCartIdByGuestId(guestId);
        const cartId = cart?.id;
        if(!cartId){
            logger.info(`No active cart found for guests ${guestId}`);
            ws.close(1008,"Cart not found");
            return;
        }

        // joining cart room
        if(!cartRooms.has(cartId)){
            cartRooms.set(cartId,new Set());

        }
        cartRooms.get(cartId).add(ws);
        ws.cartId = cartId;
        logger.info(`Gusts ${guestId} joined Cart ${cartId}`);
        // disconnecting

        ws.on("close",()=>{
            const room = cartRooms.get(cartId);
            if(room){
                room.delete(ws);
                if(room.size === 0){
                    cartRooms.delete(cartId);
                }
            }

            logger.info(`Guests ${guestId} disconnected from Cart ${cartId}`);

        });
    });

    

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