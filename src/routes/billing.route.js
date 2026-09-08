import express from "express";
 import {
    getBillingSummaryController,
    splitBillController
 } from "../controllers/billing.controller.js";

 const router = express.Router();

 //Billing Summary
 router.get("/summary", getBillingSummaryController);
 
 //splitting Bill
 router.post("/split",splitBillController);

 export default router;