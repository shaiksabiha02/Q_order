import {
    staffLogin,
    refreshAccessToken,
    logoutStaff,
} from "../services/auth.service.js";

export const loginStaff = async (req, res) => {
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
};

export const refreshToken = async (req, res) => {
    const { refresh_token } = req.body;

    const result = await refreshAccessToken(
        refresh_token
    );

    return res.status(200).json({
        success: true,
        message: "Token refreshed successfully",
        data: result,
    });
};

export const logout = async (req, res) => {
    const { refresh_token } = req.body;

    await logoutStaff(refresh_token);

    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
};

