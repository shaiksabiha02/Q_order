import { 
    fetchBillingSummary,
    splitBill
} from "../services/billing.service.js";

export const getBillingSummaryController = async (req , res) => {
     const tenantId = req.headers["x-tenant-id"];
     const orderId = req.query.order_id;

     const result = await fetchBillingSummary({
        tenantId,
        orderId
     });

     res.status(200).json({
        success : true,
        data: result
     });
};



export const splitBillController = async (req,res) => {

    const tenantId = req.headers["x-tenant-id"];
     const {
        orderId,
        splitType,
        parts,
        items
     }=req.body;

     const result = await splitBill({
        tenantId,
        orderId,
        splitType,
        parts,
        items
     });

     res.status(200).json({
        success:true,
        data: result
     });
};