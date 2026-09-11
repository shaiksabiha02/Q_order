import Joi from "joi";

const createCartSchema = Joi.object({
    tenant_id: Joi.string().uuid().required(),
    branch_id: Joi.string().uuid().required(),
    table_id: Joi.string().uuid().required(),
    status: Joi.string().allow("", null),
    discount: Joi.number().min(0).allow(null),
    platform_fee: Joi.number().min(0).allow(null)
});

const addCartItemSchema = Joi.object({
    item_id: Joi.string().uuid().required(),
    variant_id: Joi.string().uuid().allow(null),
    modifier_ids: Joi.array().allow(null),
    qty: Joi.number().integer().min(1).required(),
    notes: Joi.string().allow("", null)
});

const updateCartItemSchema = Joi.object({
    qty: Joi.number().integer().min(1),
    variant_id: Joi.string().uuid().allow(null),
    modifier_ids: Joi.array().allow(null),
    notes: Joi.string().allow("", null)
}).min(1);

const cartItemIdSchema = Joi.object({
    cart_item_id: Joi.string().uuid().required()
});

const validateCart = (req, res, next) => {
    const { error } = createCartSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateAddCartItem = (req, res, next) => {
    const { error } = addCartItemSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateUpdateCartItem = (req, res, next) => {
    const { error } = updateCartItemSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateCartItemId = (req, res, next) => {
    const { error } = cartItemIdSchema.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export default validateCart;