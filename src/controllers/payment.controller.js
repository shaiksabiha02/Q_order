import { createPaymentIntent,
        processPaymentWebhook,
        createCashRequest
} from "../services/payment.service.js";

export const createPaymentIntentController = async (req, res)=>{
    const{
        amount,
        currency,
        split_details,
        order_id
    } = req. body;

    const tenantId = req.headers["x-tenant-id"];
    
    const result = await createPaymentIntent({
        tenantId,
        orderId: order_id,
        amount,
        currency,
        splitDetails:split_details
     });

     res.status(201).json({
     success:true,
     message:"Payment intent created successfully",
     data:result
    });
    
};


export const paymentWebhookController = async (req, res) => {

    const signature = req.headers["x-razorpay-signature"];

    const result = await processPaymentWebhook({
        rawBody: req.body,
        signature
    });

    res.status(200).json({
        success:true,
        message:result.message
    });

};


export const createCashRequestController = async (req,res)=>{
    const {
        order_id,
        amount
    }=req.body;
    const tenantId=req.headers["x-tenant-id"];

    const result=await createCashRequest({
        tenantId,
        orderId:order_id,
        amount:amount
    });

    res.status(201).json({

        success:true,
        message:"Cash payment request created successfully",
        data:result
    });
}