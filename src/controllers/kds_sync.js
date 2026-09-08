import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const syncKds = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];

    const lastEventId = req.query.last_event_id || 0;

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID and Branch ID are required"
      });
    }

    const events = await kdsService.getKdsSync(
      tenantId,
      branchId,
      lastEventId
    );

    return res.status(200).json({
      success: true,
      data: events
    });

  } catch (error) {
    logger.error(`Error syncing KDS: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to sync KDS"
    });
  }
};