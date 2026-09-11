import Joi from "joi";

const createTenantSchema = Joi.object({
    company_name: Joi.string()
        .max(150)
        .required(),

    tax_identifier: Joi.string()
        .max(50)
        .required(),

    status: Joi.string()
        .valid("ACTIVE", "SUSPENDED")
        .default("ACTIVE")
});

const updateTenantStatusSchema = Joi.object({
    status: Joi.string()
        .valid("ACTIVE", "SUSPENDED")
        .required()
});

const tenantIdSchema = Joi.object({
    id: Joi.string()
        .uuid()
        .required()
});

export const validateCreateTenant = (req, res, next) => {
    const { error, value } =
        createTenantSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    req.body = value;
    next();
};

export const validateTenantId = (req, res, next) => {
    const { error } =
        tenantIdSchema.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateTenantStatus = (req, res, next) => {
    const { error, value } =
        updateTenantStatusSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    req.body = value;
    next();
};

export default {
    createTenantSchema,
    updateTenantStatusSchema,
    tenantIdSchema
};