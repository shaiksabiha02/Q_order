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

    const guestId = crypto.randomUUID();

    const expiresAt = new Date(
        Date.now() + 12 * 60 * 60 * 1000
    );

    await createGuestSession(
        guestId,
        table.tenant_id,
        table.branch_id,
        table.id,
        expiresAt
    );

    const token = jwt.sign(
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

    return {
        access_token: token,
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