import analyticsService from "../services/analytics.service.js";

const getGMV = async (req, res) => {
    try {
        const gmv = await analyticsService.getGMV();

        return res.status(200).json({
            message: "GMV fetched successfully",
            data: gmv
        });

    } catch (error) {
        console.error("Get GMV error:", error);

        return res.status(500).json({
            message: "Error fetching GMV"
        });
    }
};

export default {
    getGMV
};