import {
    getRestaurantProfile,
} from "../repositories/restaurant.repository.js";

export const fetchRestaurantProfile = async (
    tenantId,
    branchId
) => {
    const branch = await getRestaurantProfile(
        tenantId,
        branchId
    );

    if (!branch) {
        throw new Error("Restaurant profile not found");
    }

    return {
        id: branch.id,
        tenant_id: branch.tenant_id,
        name: branch.name,
        address: branch.address,
        timezone: branch.timezone,
        currency: branch.currency,
        tax_rate: branch.tax_rate,
        created_at: branch.created_at,
    };
};