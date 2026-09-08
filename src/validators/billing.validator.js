import Joi from "joi";

// Validation for Billing Summary

const billingSummarySchema = Joi.object({
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
        })
});

export const validateBillingSummary = (data) => {

    const { error } = billingSummarySchema.validate(data);

    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        throw err;
    }
};


// Validation for Split Bill

const splitBillSchema = Joi.object({
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

    splitType: Joi.string()
        .valid("EQUAL", "BY_ITEM")
        .required()
        .messages({
            "any.required": "Split type is required",
            "string.empty": "Split type is required",
            "any.only": "Split type must be EQUAL or BY_ITEM"
        }),

    parts: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "any.required": "Parts are required",
            "number.base": "Parts must be a number",
            "number.integer": "Parts must be a positive integer",
            "number.positive": "Parts must be a positive integer"
        }),

    items: Joi.when("splitType", {
        is: "BY_ITEM",
        then: Joi.array()
            .min(1)
            .items(
                Joi.object({
                    order_item_id: Joi.string()
                        .required()
                        .messages({
                            "any.required": "Order item ID is required",
                            "string.empty": "Order item ID is required"
                        }),

                    assigned_parts: Joi.array()
                        .min(1)
                        .items(
                            Joi.number()
                                .integer()
                                .min(1)
                        )
                        .required()
                        .messages({
                            "any.required": "Assigned parts are required",
                            "array.min": "Assigned parts are required"
                        })
                })
            )
            .required()
            .messages({
                "any.required": "Items are required for BY_ITEM split",
                "array.min": "Items are required for BY_ITEM split"
            }),

        otherwise: Joi.optional()
    })
})
.custom((value, helpers) => {

    // Only validating assigned parts for BY_ITEM
    if (value.splitType === "BY_ITEM") {

        for (const item of value.items) {

            for (const part of item.assigned_parts) {

                if (part > value.parts) {
                    return helpers.message(
                        `Assigned part must be between 1 and ${value.parts}`
                    );
                }
            }
        }
    }

    return value;
});

export const validateSplitBill = (data) => {

    const { error } = splitBillSchema.validate(data);

    if (error) {
        const err = new Error(error.details[0].message);
        err.statusCode = 400;
        throw err;
    }
};