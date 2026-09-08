import Joi from "joi";

// Validation for Payment Intent

const paymentIntentSchema = Joi.object({
    tenantId: Joi.string()
        .required()
        .messages({
            "any.required": "X-Tenant-ID header is required",
            "string.empty": "X-Tenant-ID header is required"
        }),

    orderId: Joi.string()
        .required()
        .messages({
            "any.required": "Order ID is required",
            "string.empty": "Order ID is required"
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            "any.required": "Amount is required",
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than 0"
        }),

    currency: Joi.string()
        .required()
        .messages({
            "any.required": "Currency is required",
            "string.empty": "Currency is required"
        })
});

export const validatePaymentIntent = (data) => {
    const { error } = paymentIntentSchema.validate(data);

    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        throw err;
    }
};


// Validation for Cash Request

const cashRequestSchema = Joi.object({
    tenantId: Joi.string()
        .required()
        .messages({
            "any.required": "X-Tenant-ID header is required",
            "string.empty": "X-Tenant-ID header is required"
        }),

    orderId: Joi.string()
        .required()
        .messages({
            "any.required": "Order ID is required",
            "string.empty": "Order ID is required"
        }),

    amount: Joi.number()
        .positive()
        .required()
        .messages({
            "any.required": "Amount is required",
            "number.base": "Amount must be a number",
            "number.positive": "Amount must be greater than 0"
        })
});

export const validateCashRequest = (data) => {
    const { error } = cashRequestSchema.validate(data);

    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        throw err;
    }
};