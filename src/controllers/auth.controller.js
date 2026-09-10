import {
    staffLogin,
    refreshAccessToken,
    logoutStaff,
} from "../services/auth.service.js";

import logger from "../config/logger.js";

export const loginStaff = async (req, res) => {
    try {
        const { username, pin } = req.body;

        const result = await staffLogin(
            username,
            pin
        );

        return res.status(200).json({
            success: true,
            message: "Staff login successful",
            data: result,
        });

    } catch (error) {
        logger.error("Staff Login Error", {
            error: error.message,
        });

        if (error.message === "Invalid username or PIN") {
            return res.status(401).json({
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

export const refreshToken = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        const result = await refreshAccessToken(
            refresh_token
        );

        return res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
            data: result,
        });

    } catch (error) {
        logger.error("Refresh Token Error", {
            error: error.message,
        });

        if (
            error.message === "Invalid refresh token" ||
            error.message === "Refresh token has expired" ||
            error.message === "Refresh token has been revoked"
        ) {
            return res.status(401).json({
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

export const logout = async (req, res) => {
    try {
        const { refresh_token } = req.body;

        await logoutStaff(refresh_token);

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });

    } catch (error) {
        logger.error("Logout Error", {
            error: error.message,
        });

        if (error.message === "Invalid refresh token") {
            return res.status(401).json({
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