import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const updateItemStatus = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];
    const itemId = req.params.item_id;

    const status = req.body?.status?.toUpperCase();

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "X-Tenant-ID and X-Branch-ID are required"
      });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "status is required"
      });
    }

    const allowedStatuses = ["PREPARING", "READY"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "status must be PREPARING or READY"
      });
    }

    const result = await kdsService.updateItemStatus(
      tenantId,
      branchId,
      itemId,
      status
    );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Order item not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error(`Error updating KDS item status: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to update item status"
    });
  }
};