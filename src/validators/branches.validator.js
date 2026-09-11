import Joi from "joi";

const createBranchSchema = Joi.object({
    name: Joi.string().max(100).required(),

    address: Joi.string()
        .allow("", null),

    timezone: Joi.string()
        .max(50)
        .default("UTC"),

    currency: Joi.string()
        .max(10)
        .default("USD"),

    tax_rate: Joi.number()
        .min(0)
        .max(999.99)
        .default(0.00)
});

const tenantIdSchema = Joi.object({
    id: Joi.string().uuid().required()
});

export const validateCreateBranch = (req, res, next) => {
    const { error, value } =
        createBranchSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    req.body = value;
    next();
};

export const validateBranchTenantId = (req, res, next) => {
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
    createBranchSchema,
    tenantIdSchema
};