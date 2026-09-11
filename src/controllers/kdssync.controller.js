import * as kdsService from "../services/kds.service.js";

export const syncKds = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];
    const lastEventId = req.query.last_event_id;

    const events = await kdsService.syncKds(
      tenantId,
      branchId,
      lastEventId
    );

    return res.status(200).json({
      success: true,
      message: "KDS sync completed",
      data: events
    });
  } catch (error) {
    logger.error(`Error syncing KDS events: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to sync KDS events"
    });
  }
};