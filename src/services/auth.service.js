import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import {
    findStaffByUsername,
    findStaffById,
    createAuthSession,
    findAuthSessionByRefreshTokenHash,
    findGuestSessionByRefreshToken,
    updateGuestAccessToken,
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

const generateGuestAccessToken = (guestSession) => {
    return jwt.sign(
        {
            type: "GUEST",
            guest_id: guestSession.guest_id,
            table_id: guestSession.table_id,
            tenant_id: guestSession.tenant_id,
            branch_id: guestSession.branch_id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "12h",
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
        throw new Error(
            "Invalid username or PIN"
        );
    }

    const validPin = await bcrypt.compare(
        pin,
        staff.pin_code
    );

    if (!validPin) {
        throw new Error(
            "Invalid username or PIN"
        );
    }

    const accessToken =
        generateAccessToken(staff);

    const refreshToken =
        crypto.randomBytes(64).toString("hex");

    const refreshTokenHash =
        hashRefreshToken(refreshToken);

    const expiresAt = new Date(
        Date.now() +
        7 * 24 * 60 * 60 * 1000
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

export const refreshAccessToken = async (
    refreshToken
) => {
    const refreshTokenHash =
        hashRefreshToken(refreshToken);

    const staffSession =
        await findAuthSessionByRefreshTokenHash(
            refreshTokenHash
        );

    if (staffSession) {
        if (staffSession.revoked_at) {
            throw new Error(
                "Refresh token has been revoked"
            );
        }

        if (
            new Date(staffSession.expires_at) <=
            new Date()
        ) {
            throw new Error(
                "Refresh token has expired"
            );
        }

        const staff = await findStaffById(
            staffSession.staff_user_id
        );

        if (!staff) {
            throw new Error(
                "Invalid refresh token"
            );
        }

        const accessToken =
            generateAccessToken(staff);

        return {
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: 3600,
        };
    }

    const guestSession =
        await findGuestSessionByRefreshToken(
            refreshToken
        );

    if (!guestSession) {
        throw new Error(
            "Invalid refresh token"
        );
    }

    if (
        new Date(guestSession.expires_at) <=
        new Date()
    ) {
        throw new Error(
            "Refresh token has expired"
        );
    }

    const accessToken =
        generateGuestAccessToken(
            guestSession
        );

    await updateGuestAccessToken(
        guestSession.id,
        accessToken
    );

    return {
        access_token: accessToken,
        token_type: "Bearer",
        expires_in: 43200,
    };
};

export const logoutStaff = async (
    refreshToken
) => {
    const refreshTokenHash =
        hashRefreshToken(refreshToken);

    const session =
        await findAuthSessionByRefreshTokenHash(
            refreshTokenHash
        );

    if (!session) {
        throw new Error(
            "Invalid refresh token"
        );
    }

    await revokeAuthSession(session.id);

    return true;
};