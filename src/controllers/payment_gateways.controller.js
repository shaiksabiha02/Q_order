import paymentGatewaysService
    from "../services/payment_gateways.service.js";

const createPaymentGateway = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            gateway_name,
            gateway_account_id,
            api_key,
            secret_key,
            status
        } = req.body;

        const paymentGateway =
            await paymentGatewaysService.createPaymentGateway(
                id,
                gateway_name,
                gateway_account_id,
                api_key,
                secret_key,
                status
            );

        return res.status(201).json({
            message: "Payment gateway created successfully",
            data: paymentGateway
        });

    } catch (error) {
        console.error(
            "Create payment gateway error:",
            error
        );

        if (error.code === "23503") {
            return res.status(404).json({
                message: "Tenant not found"
            });
        }

        return res.status(500).json({
            message: "Error creating payment gateway"
        });
    }
};

export default {
    createPaymentGateway
};