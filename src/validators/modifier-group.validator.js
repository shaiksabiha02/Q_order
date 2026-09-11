import joi from 'joi';
const modifierGroupSchema = joi.object({
    tenant_id: joi.string().required(),
    name: joi.string().trim().required(),
    min_selection: joi.number().integer().min(0).required(),
    max_selection: joi.number().integer().min(0).required(),
    created_by: joi.string().required()
});

const updateModifierGroupSchema = joi.object({
    name: joi.string().trim().required(),
    min_selection: joi.number().integer().min(0).required(),
    max_selection: joi.number().integer().min(0).required()
});
export function validateCreateModifierGroup(req, res, next) {
    const { error } = modifierGroupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

export function validateUpdateModifierGroup(req, res, next) {
    const { error } = updateModifierGroupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}