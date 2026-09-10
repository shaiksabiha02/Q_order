import branchesRepository from "../repositories/branches.repository.js";

const createBranch = async (
    tenant_id,
    name,
    address,
    timezone,
    currency,
    tax_rate
) => {
    return await branchesRepository.createBranch(
        tenant_id,
        name,
        address,
        timezone,
        currency,
        tax_rate
    );
};

export default {
    createBranch
};