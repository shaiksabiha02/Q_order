import {
    fetchTables,
    clearDiningTable,
} from "../services/diningTables.service.js";

export const getTables = async (req, res) => {
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
};

export const clearTable = async (req, res) => {
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
};

