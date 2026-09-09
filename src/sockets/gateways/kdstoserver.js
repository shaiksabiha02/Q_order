import { WebSocket, WebSocketServer } from "ws";

// Import the existing KDS service from your teammate
// Change this to the actual service/function name
// import { updateItemStatus } from "../../services/Kds.service.js";

export const createkdstoserversocket =(server)=>{

    //creating websocket server
    const wss = new WebSocketServer({
        server,
        path:"/ws/v1/kds/stream"
    });
    // here kds connection
    wss.on("connection",(ws)=>{
        console.log("KDS connected");
        ws.on("message",async(message)=>{
            try{
                const data = JSON.parse(message);
                if(data.event === "ITEM_STATUS_CHANGED"){
                    const{
                        order_item_id,
                        new_status
                    }=data.data;
                    console.log(
                        "ITEM_STATUS_CHANGED:",
                        order_item_id,
                        new_status
                    );

                  // ==================================
                    // CALL EXISTING KDS SERVICE
                    // ==================================

                    // Do NOT update the database directly here.
                    //
                    // Reuse the KDS teammate's existing
                    // update service.
                    //
                    // Example:
                    //
                    // await updateItemStatus(
                    //     order_item_id,
                    //     new_status
                    // );


                    // ==================================
                    // ACKNOWLEDGE TO KDS
                    // ==================================
                 ws.send(
                    JSON.stringify({
                       event:"ITEM_STATUS_CHANGED_ACK",
                       data:{
                        order_item_id,
                        new_status
                       } 
                    })
                 );
                }
            }catch(error){
                console.error("Invalid KDS message:",error);
                ws.send(JSON.stringify({
                    event:"ERROR",
                    message:"Invalid Websocket message"                
                })
            );
            }
        });

        // kds disconnected 

        ws.on("close",()=>{
            console.log("KDS disconnected");
        });

        //websocket error 
        ws.on("error",(error)=>{
            console.error("KDS websocket error:",error);
        });
    });

    console.log("KDS server websocket started")
};
