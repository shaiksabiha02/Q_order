import * as kdsService from "../services/kds.service.js";

export const updateItemStatus = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];
    const itemId = req.params.item_id;
    const status = req.body.status;

    const result = await kdsService.updateItemStatus(
      tenantId,
      branchId,
      itemId,
      status
    );

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