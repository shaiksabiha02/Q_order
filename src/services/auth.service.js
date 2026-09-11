import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
    findStaffByUsername,
    findStaffById,
    createAuthSession,
    findAuthSessionByRefreshTokenHash,
    revokeAuthSession,
} from "../repositories/auth.repository.js";

const generateAccessToken = (staff) => {
    return jwt.sign(
        {
            user_id: staff.id,
            tenant_id: staff.tenant_id,
            branch_id: staff.branch_id,
            role: staff.role,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
};

const hashRefreshToken = (refreshToken) => {
    return crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");
};

export const staffLogin = async (username, pin) => {
    const staff = await findStaffByUsername(username);

    if (!staff) {
        throw new Error("Invalid username or PIN");
    }

    const validPin = await bcrypt.compare(
        pin,
        staff.pin_code
    );

    if (!validPin) {
        throw new Error("Invalid username or PIN");
    }

    const accessToken = generateAccessToken(staff);

    const refreshToken = crypto
        .randomBytes(64)
        .toString("hex");

    const refreshTokenHash = hashRefreshToken(
        refreshToken
    );

    const expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    );

    await createAuthSession(
        staff.id,
        refreshTokenHash,
        expiresAt
    );

    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: "Bearer",
        expires_in: 3600,
        refresh_expires_in: 604800,

        user: {
            id: staff.id,
            username: staff.username,
            role: staff.role,
            tenant_id: staff.tenant_id,
            branch_id: staff.branch_id,
        },
    };
};

export const refreshAccessToken = async (refreshToken) => {
    const refreshTokenHash = hashRefreshToken(
        refreshToken
    );

    const session =
        await findAuthSessionByRefreshTokenHash(
            refreshTokenHash
        );

    if (!session) {
        throw new Error("Invalid refresh token");
    }

    if (session.revoked_at) {
        throw new Error(
            "Refresh token has been revoked"
        );
    }

    if (new Date(session.expires_at) <= new Date()) {
        throw new Error(
            "Refresh token has expired"
        );
    }

    const staff = await findStaffById(
        session.staff_user_id
    );

    if (!staff) {
        throw new Error("Invalid refresh token");
    }

    const accessToken = generateAccessToken(staff);

    return {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 3600,
    };
};

export const logoutStaff = async (refreshToken) => {
    const refreshTokenHash = hashRefreshToken(
        refreshToken
    );

    const session =
        await findAuthSessionByRefreshTokenHash(
            refreshTokenHash
        );

    if (!session) {
        throw new Error("Invalid refresh token");
    }

    await revokeAuthSession(session.id);

    return true;
};