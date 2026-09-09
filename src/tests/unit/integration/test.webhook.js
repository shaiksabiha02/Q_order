import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

const payload = JSON.stringify({
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test123",
        order_id: "order_TZuF2D2Cg1XDCq"
      }
    }
  }
});

const signature = crypto
  .createHmac("sha256", webhookSecret)
  .update(payload)
  .digest("hex");

console.log("PAYLOAD:");
console.log(payload);

console.log("\nSIGNATURE:");
console.log(signature);