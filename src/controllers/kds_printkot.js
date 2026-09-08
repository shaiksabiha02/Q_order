import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const printKot = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];

    const orderId = req.body.order_id;
    const printerIp = req.body.printer_ip;
    const rawBytes = req.body.raw_bytes;

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID and Branch ID are required"
      });
    }

    if (!orderId || !printerIp || !rawBytes) {
      return res.status(400).json({
        success: false,
        message: "Print details are required"
      });
    }

    const job = await kdsService.printKot(
      tenantId,
      branchId,
      orderId,
      printerIp,
      rawBytes
    );

    return res.status(201).json({
      success: true,
      message: "Print job created",
      data: job
    });

  } catch (error) {
    logger.error(`Error creating print job: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to create print job"
    });
  }
};