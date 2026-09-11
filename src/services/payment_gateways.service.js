import paymentGatewaysRepository from "../repositories/payment_gateways.repository.js";

const createPaymentGateway = async (
    tenant_id,
    gateway_name,
    gateway_account_id,
    api_key,
    secret_key,
    status
) => {
    return await paymentGatewaysRepository.createPaymentGateway(
        tenant_id,
        gateway_name,
        gateway_account_id,
        api_key,
        secret_key,
        status
    );
};

export default {
    createPaymentGateway
};