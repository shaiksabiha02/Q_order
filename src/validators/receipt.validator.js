import Joi from "joi";

const receiptSmsSchema = Joi.object({
    phone_number: Joi.string()
        .trim()
        .pattern(/^\+[1-9]\d{7,14}$/)
        .required(),

    message: Joi.string()
        .trim()
        .min(1)
        .max(1600)
        .required(),

    receipt_reference: Joi.string()
        .trim()
        .max(100)
        .required()
});

export const validateReceiptSms = (req, res, next) => {
    const { error, value } = receiptSmsSchema.validate(req.body, {
        abortEarly: true,
        stripUnknown: true
    });

    if (error) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            error: error.details[0].message
        });
    }

    req.body = value;
    next();
};