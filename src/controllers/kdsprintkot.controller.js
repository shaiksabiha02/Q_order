import * as kdsService from "../services/kds.service.js";

export const printKot = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];

    const {
      order_id,
      printer_ip,
      raw_bytes
    } = req.body;

    const result = await kdsService.printKot(
      tenantId,
      branchId,
      order_id,
      printer_ip,
      raw_bytes
    );

    return res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error(`Error creating KOT print job: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to create KOT print job"
    });
  }
};