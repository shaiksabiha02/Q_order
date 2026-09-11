import {
    fetchRestaurantProfile,
} from "../services/restaurant.service.js";

import logger from "../config/logger.js";

export const getRestaurantProfile = async (req, res) => {
    try {
        const {
            tenant_id,
            branch_id,
        } = req.user;

        const result = await fetchRestaurantProfile(
            tenant_id,
            branch_id
        );

        return res.status(200).json({
            success: true,
            message: "Restaurant profile fetched successfully",
            data: result,
        });

    } catch (error) {
        logger.error("Restaurant Profile Error", {
            error: error.message,
        });

        if (
            error.message ===
            "Restaurant profile not found"
        ) {
            return res.status(404).json({
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