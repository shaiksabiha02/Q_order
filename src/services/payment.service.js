import crypto from "crypto";
import razorpay from "../sockets/gateways/razorpay.gateway.js";
import { createPaymentLedger,
         updatePaymentLedgerStatus,
         createCashPaymentRequest
 } from "../repositories/payment.repository.js";

 import {
    validatePaymentIntent,
    validateCashRequest
 } from "../validators/payment.validator.js";

export const createPaymentIntent = async ({
    tenantId,
    orderId,
    amount,
    currency,
    splitDetails
})  => {

    validatePaymentIntent({
        tenantId,
        orderId,
        amount,
        currency
    });

    
    //Creating Razorpay order
    const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(Number(amount)* 100),
        currency:currency.toUpperCase(),
        receipt: `order_${orderId}`
    });

    //Generating our internal transaction reference
    const transactionReference = `TXN_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    //saving payment information in payment_ledger
    const payment = await createPaymentLedger({
        tenantId,
        orderId,
        transactionReference,
        paymentIntentId: razorpayOrder.id,
        amount,
        gatewayProvider: "RAZORPAY"
    });

    return {
        payment_intent_id:razorpayOrder.id,
        amount: Number(amount),
        currency:currency.toUpperCase(),
        split_details:splitDetails || null,
        status:payment.status
    };

}




export const processPaymentWebhook = async ({
    rawBody,
    signature
}) => {
     if(!signature){
        const error = new Error("Razorpay signature is missing");
        error.statusCode = 400;
        throw error;
     }

     const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

     if(!webhookSecret){
        const error = new Error("Razorpay webhook secret is not configured");
        error.statusCode = 500;
        throw error;
     }

     //Generating HMAC using the raw Webhook body
     const expectedSignature = crypto
     .createHmac("sha256",webhookSecret)
     .update(rawBody)
     .digest("hex");

     if (expectedSignature !== signature) {
        const error = new Error("Invalid Razorpay webhook signature");
        error.statusCode = 400;
        throw error;
    }

     //comparing raw body to json only after signature verification
     const payload = JSON.parse(rawBody.toString());

     if(payload.event !== "payment.captured"){
        return{
            message: "Webhook received but event was ignored"
        };
     }

     const payment = payload.payload?.payment?.entity;

     if(!payment){
        const error = new Error("Payment data is missing from webhook");
        error.statusCode = 400;
        throw error;

     }

     const updatedPayment = await updatePaymentLedgerStatus({
        paymentIntentId:payment.order_id,
        status:"CAPTURED"
     });

     if(!updatedPayment){
        const error=new Error( "Payment ledger record not found for this Razorpay order");
        error.statusCode = 404;
        throw error;
     }
     return {
        message:"Payment captured webhook proceed successfully",
        paymentId:payment.id,
        orderId:payment.order_id,
        status:updatedPayment.status
    
     };

};



export const createCashRequest = async({
    tenantId,
    orderId,
    amount
}) =>{

    validateCashRequest({
        tenantId,
        orderId,
        amount
    });

    const cashRequest = await createCashPaymentRequest({
        tenantId,
        orderId,
        amount
    });
    
    return cashRequest;
}