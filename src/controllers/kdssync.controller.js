import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const syncKds = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];

    const lastEventId = Number(req.query.last_event_id ?? 0);

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "X-Tenant-ID and X-Branch-ID are required"
      });
    }

    if (Number.isNaN(lastEventId) || lastEventId < 0) {
      return res.status(400).json({
        success: false,
        message: "last_event_id must be a valid number"
      });
    }

    const result = await kdsService.syncKds(
      tenantId,
      branchId,
      lastEventId
    );

    return res.status(200).json({
      success: true,
      message: "KDS sync completed",
      data: result
    });

  } catch (error) {
    logger.error(`Error syncing KDS events: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to sync KDS events"
    });
  }
};