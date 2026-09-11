import joi from 'joi';

const modifierOptionSchema = joi.object({
    group_id: joi.string().required(),
    name: joi.string().trim().required(),
    price_delta: joi.number().required()
});

const updateModifierOptionSchema = joi.object({
    group_id: joi.string().required(),
    name: joi.string().trim().required(),
    price_delta: joi.number().required()
});

export function validateCreateModifierOption(req, res, next) {
    const { error } = modifierOptionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export function validateUpdateModifierOption(req, res, next) {
    const { error } = updateModifierOptionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
