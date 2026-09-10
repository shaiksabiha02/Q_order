import Joi from "joi";

const createPaymentGatewaySchema = Joi.object({
    gateway_name: Joi.string().max(50).required(),
    gateway_account_id: Joi.string().max(255).allow("", null),
    api_key: Joi.string().max(500).allow("", null),
    secret_key: Joi.string().max(500).allow("", null),
    status: Joi.string()
        .valid("ACTIVE", "INACTIVE")
        .default("ACTIVE")
});

const tenantIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});

export const validateCreatePaymentGateway = (req, res, next) => {
    const { error, value } =
        createPaymentGatewaySchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    req.body = value;
    next();
};

export const validatePaymentGatewayTenantId = (req, res, next) => {
    const { error } =
        tenantIdSchema.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export default {
    createPaymentGatewaySchema,
    tenantIdSchema
};