import { WebSocketServer,WebSocket } from "ws";
import { orderEvents } from "../../events/order.event.js";
export const createServerTokdsSocket = (server)=>{
    //creating websocket server
    const wss = new WebSocketServer({
        server,
        path: "/ws/v1/kds/stream"
    });

    // KDS connection

    wss.on("connection",(ws)=>{
        console.log("Kds connected to server to KDS socket");
        ws.on("close",()=>{
            console.log("KDS disconnected from server");
        });
        ws.on("error",(error)=>{
            console.error("Kds web socket error:",error);
        });
    });

    // server to kds new_order_recived

    orderEvents.on("NEW_ORDER_RECEIVED",(order)=>{
        console.log("NEW_ORDER_RECEIVED:",order);
        // sending to connected kds clients

        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN){
                client.send(
                    JSON.stringify({
                        event:"NEW_ORDER_RECIEVED",
                        data:{
                            order_id:order.order_id,
                            table_name:order.table_name,
                            items:order.items
                        }
                    })
                );
            }
        
    });
});
console.log("server to KDS Websocket started");
};