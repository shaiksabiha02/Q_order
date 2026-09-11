import twilio from "twilio";

import { createReceiptSmsLog } from "../repositories/receipt.repository.js";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_PHONE_NUMBER;

const client =
    accountSid && authToken
        ? twilio(accountSid, authToken)
        : null;

export const sendReceipt = async ({
    phoneNumber,
    message,
    receiptReference
}) => {
    if (!client || !fromNumber) {
        const error = new Error(
            "Twilio credentials are not configured"
        );

        error.statusCode = 500;

        throw error;
    }

    console.log("Sending Twilio message:", {
        phoneNumber,
        message,
        fromNumber
    });

    const response = await client.messages.create({
        body: message,
        from: fromNumber,
        to: phoneNumber
    });

    const result = await createReceiptSmsLog({
        phoneNumber,
        message,
        receiptReference,
        provider: "twilio",
        providerMessageId: response.sid,
        status: "sent",
        sentAt: new Date(),
        errorMessage: null
    });

    return result;
};