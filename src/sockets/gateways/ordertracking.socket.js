import { WebSocket } from "ws";
import { orderEvents } from "../../events/order.event";

export const createOrderTrackingSocket = (server)=>{
    const wss = new WebSocketServer({
        server,
        path:"/ws/v1/orders/track"
    });

    //when client is connection to websocket

    wss.on("connection",(ws,request)=>{
        
        console.log("Guest connected to order tracking Webosket");

        ws.on("close",()=>{
            console.log("Guest disconnected for order tracking");

    });
    
    ws.on("error",(error)=>{
        console.log("Wesocket error:",error);

    });

    });
    //Listining for order status updates

    orderEvents.on("ORDER_STATUS_UPDATED",(order)=>{
        console.log("Order status updated:",order);
        wss.clients.forEach((client)=>{
            //sending only to the client tracking this order

            if(
                client.readyState === WebSocket.OPEN){
            
                client.send(
                    JSON.stringify({
                        event:"ORDER_STATUS_UPDATED",
                        data:{
                            order_id:order.order_id,
                            status:order.status,
                            timestamp:order.timestamp
                        }
                    })
                );
            }
        });

    });
    console.log("Order tracking Websocket started");
};
   