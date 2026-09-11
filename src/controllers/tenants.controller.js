import tenantsService from "../services/tenants.service.js";

const createTenant = async (req, res) => {
    try {
        const {
            company_name,
            tax_identifier,
            status
        } = req.body;

        const tenant = await tenantsService.createTenant(
            company_name,
            tax_identifier,
            status
        );

        return res.status(201).json({
            message: "Tenant created successfully",
            data: tenant
        });

    } catch (error) {
        console.error("Create tenant error:", error);

        return res.status(500).json({
            message: "Error creating tenant"
        });
    }
};

const getAllTenants = async (req, res) => {
    try {
        const tenants =
            await tenantsService.getAllTenants();

        return res.status(200).json({
            message: "Tenants fetched successfully",
            data: tenants
        });

    } catch (error) {
        console.error("Get tenants error:", error);

        return res.status(500).json({
            message: "Error fetching tenants"
        });
    }
};

const updateTenantStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const tenant =
            await tenantsService.updateTenantStatus(
                id,
                status
            );

        if (!tenant) {
            return res.status(404).json({
                message: "Tenant not found"
            });
        }

        return res.status(200).json({
            message: "Tenant status updated successfully",
            data: tenant
        });

    } catch (error) {
        console.error(
            "Update tenant status error:",
            error
        );

        return res.status(500).json({
            message: "Error updating tenant status"
        });
    }
};

export default {
    createTenant,
    getAllTenants,
    updateTenantStatus
};