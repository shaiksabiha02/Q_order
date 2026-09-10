import {
    createAssistanceRequest,
    getAssistanceRequests,
    resolveAssistanceRequest
} from "../repositories/assistance.repository.js";

export const createRequest = async (data) => {

    if (!data.id) {
        throw new Error("Assistance ID is required");
    }

    if (!data.guest_id) {
        throw new Error("Guest ID is required");
    }

    if (!data.table_id) {
        throw new Error("Table ID is required");
    }

    if (!data.type) {
        throw new Error("Assistance type is required");
    }

    if (!["WATER", "BILL", "WAITER"].includes(data.type)) {
        throw new Error("Invalid assistance type");
    }

    const result = await createAssistanceRequest(data);

    if (!result) {
        throw new Error("Assistance request could not be created");
    }

    return result;
};

export const getActiveRequests = async (page, limit) => {

    if (page < 1) {
        throw new Error("Invalid page");
    }

    if (limit < 1 || limit > 100) {
        throw new Error("Invalid limit");
    }

    return await getAssistanceRequests(page, limit);
};

export const resolveRequest = async (id, status) => {

    if (!id) {
        throw new Error("Assistance ID is required");
    }

    if (!status) {
        throw new Error("Status is required");
    }

    if (status !== "RESOLVED") {
        throw new Error("Status must be RESOLVED");
    }

    const result = await resolveAssistanceRequest(
        id,
        status
    );

    if (!result) {
        throw new Error("Active assistance request not found");
    }

    return result;
};