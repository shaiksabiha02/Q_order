import {
    fetchTables,
    clearDiningTable,
} from "../services/diningTables.service.js";

import logger from "../config/logger.js";

export const getTables = async (req, res) => {
    try {
        const tenantId = req.user.tenant_id;
        const branchId = req.user.branch_id;

        const tables = await fetchTables(
            tenantId,
            branchId
        );

        return res.status(200).json({
            success: true,
            message: "Tables fetched successfully",
            data: tables,
        });

    } catch (error) {
        logger.error("Get Tables Error", {
            error: error.message,
        });

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const clearTable = async (req, res) => {
    try {
        const tableId = req.params.id;

        const tenantId = req.user.tenant_id;
        const branchId = req.user.branch_id;

        const table = await clearDiningTable(
            tableId,
            tenantId,
            branchId
        );

        return res.status(200).json({
            success: true,
            message: "Table cleared successfully",
            data: table,
        });

    } catch (error) {
        logger.error("Clear Table Error", {
            error: error.message,
        });

        if (error.message === "Table not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "Table is already vacant") {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};