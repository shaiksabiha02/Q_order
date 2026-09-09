import jwt from "jsonwebtoken";
import logger from "../config/logger.js";
export function socketAuthMiddleware(ws,request){
    try{
        const url = new URL(
            request.url,
           ` http://${request.headers.host}`
        );
        const token = url.searchParams.get("token");
        if(!token){
            ws.close(1008,"Token required");
            return false;
        }
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        const guestId = decoded.guest_id || decoded.id;
        if(!guestId){
            ws.close(1008,"Guest ID not found");
            return false;

        }

        //Attaching authenticated user information to socket
        ws.guestId = guestId;
        return true;
    }catch(error){
        logger.error("Websocket authentication failed:",error.message);
        ws.close(1008,"Invalid token");
        return false;
    }
}