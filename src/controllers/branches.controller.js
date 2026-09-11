import branchesService from "../services/branches.service.js";

const createBranch = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            address,
            timezone,
            currency,
            tax_rate
        } = req.body;

        const branch = await branchesService.createBranch(
            id,
            name,
            address,
            timezone,
            currency,
            tax_rate
        );

        return res.status(201).json({
            message: "Branch created successfully",
            data: branch
        });

    } catch (error) {
        console.error("Create branch error:", error);

        if (error.code === "23503") {
            return res.status(404).json({
                message: "Tenant not found"
            });
        }

        return res.status(500).json({
            message: "Error creating branch"
        });
    }
};

export default {
    createBranch
};