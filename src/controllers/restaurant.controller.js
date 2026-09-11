import {
    fetchRestaurantProfile,
} from "../services/restaurant.service.js";

export const getRestaurantProfile = async (req, res) => {
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
};

