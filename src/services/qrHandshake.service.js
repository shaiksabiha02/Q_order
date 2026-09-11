import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
    findTableByQrToken,
    createGuestSession,
} from "../repositories/qrHandshake.repository.js";

export const qrHandshake = async (qrToken) => {
    const table = await findTableByQrToken(qrToken);

    if (!table) {
        throw new Error("Invalid QR token");
    }

    if (table.status === "BILL_REQUESTED") {
        throw new Error("Table is currently unavailable");
    }

    // Generate unique guest ID
    const guestId = crypto.randomUUID();

    // Access token expiry - 12 hours
    const expiresAt = new Date(
        Date.now() + 12 * 60 * 60 * 1000
    );

    // Generate Guest Access Token
    const accessToken = jwt.sign(
        {
            type: "GUEST",
            guest_id: guestId,
            table_id: table.id,
            tenant_id: table.tenant_id,
            branch_id: table.branch_id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
        }
    );

    // Generate Guest Refresh Token
    const refreshToken = crypto.randomBytes(64).toString("hex");

    // Store guest session and both tokens
    await createGuestSession(
        guestId,
        table.tenant_id,
        table.branch_id,
        table.id,
        accessToken,
        refreshToken,
        expiresAt
    );

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 43200,

        table: {
            id: table.id,
            floor_id: table.floor_id,
            table_number: table.table_number,
            capacity: table.capacity,
            status: table.status,
        },
    };
};