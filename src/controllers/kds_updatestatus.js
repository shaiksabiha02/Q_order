import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const updateStatus = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];

    const itemId = req.params.item_id;
    const status = req.body.status;

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID and Branch ID are required"
      });
    }

    if (!itemId || !status) {
      return res.status(400).json({
        success: false,
        message: "Item ID and status are required"
      });
    }
    logger.info(`Item status received: ${JSON.stringify(status)}`);
    
    const item = await kdsService.updateItemStatus(
      itemId,
      status,
      tenantId,
      branchId
    );

    return res.status(200).json({
      success: true,
      message: "Item status updated",
      data: item
    });

  } catch (error) {
    logger.error(`Error updating item status: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};