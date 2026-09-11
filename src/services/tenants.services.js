import tenantsRepository from "../repositories/tenants.repository.js";

const createTenant = async (
    company_name,
    tax_identifier,
    status
) => {
    return await tenantsRepository.createTenant(
        company_name,
        tax_identifier,
        status
    );
};

const getAllTenants = async () => {
    return await tenantsRepository.getAllTenants();
};

const updateTenantStatus = async (
    id,
    status
) => {
    return await tenantsRepository.updateTenantStatus(
        id,
        status
    );
};

export default {
    createTenant,
    getAllTenants,
    updateTenantStatus
};