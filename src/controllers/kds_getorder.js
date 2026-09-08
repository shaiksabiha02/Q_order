import * as kdsService from "../services/kds.service.js";
import logger from "../config/logger.js";

export const getOrders = async (req, res) => {
  try {
    const tenantId = req.headers["x-tenant-id"];
    const branchId = req.headers["x-branch-id"];
    const stationId = req.query.station_id;

    if (!tenantId || !branchId) {
      return res.status(400).json({
        success: false,
        message: "Tenant ID and Branch ID are required"
      });
    }

    const orders = await kdsService.getKdsOrders(
      tenantId,
      branchId,
      stationId
    );

    return res.status(200).json({
      success: true,
      data: orders
    });

  } catch (error) {
    logger.error(`Error getting KDS orders: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Failed to get KDS orders"
    });
  }
};