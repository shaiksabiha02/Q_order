import {
    getTables,
    getTableById,
    clearTable,
} from "../repositories/diningTables.repository.js";

export const fetchTables = async (tenantId, branchId) => {
    if (!tenantId || !branchId) {
        throw new Error("Tenant ID and Branch ID are required");
    }

    const tables = await getTables(tenantId, branchId);

    return tables.map((table) => ({
        id: table.id,
        floor_id: table.floor_id,
        table_number: table.table_number,
        capacity: table.capacity,
        status:
            table.status === "BILL_REQUESTED"
                ? "BILL_REQ"
                : table.status,
    }));
};

export const clearDiningTable = async (
    tableId,
    tenantId,
    branchId
) => {
    if (!tableId) {
        throw new Error("Table ID is required");
    }

    if (!tenantId || !branchId) {
        throw new Error("Tenant ID and Branch ID are required");
    }

    const table = await getTableById(
        tableId,
        tenantId,
        branchId
    );

    if (!table) {
        throw new Error("Table not found");
    }

    if (table.status === "VACANT") {
        throw new Error("Table is already vacant");
    }

    const updatedTable = await clearTable(
        tableId,
        tenantId,
        branchId
    );

    return {
        id: updatedTable.id,
        floor_id: updatedTable.floor_id,
        table_number: updatedTable.table_number,
        capacity: updatedTable.capacity,
        status: "VACANT",
    };
};