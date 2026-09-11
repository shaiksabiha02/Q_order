import joi from 'joi';
const createMenuItemSchema = joi.object({
    tenant_id: joi.string().required(),
    category_id: joi.string().required(),
    name: joi.string().trim().required(),
    description: joi.string().trim().required(),
    base_price: joi.number().min(0).required(),
    image_url: joi.string().uri().optional(),
    dietary_tag: joi.string().valid('VEG', 'NON_VEG', 'VEGAN', 'GLUTEN_FREE').required(),
    is_available: joi.boolean(),
    created_by: joi.string(),
    station_id: joi.string(),
    updated_by: joi.string(),
    modifier_group_ids: joi.array().items(joi.string())
});
const updateMenuItemSchema = joi.object({
    category_id: joi.string().required(),
    name: joi.string().trim().required(),
    description: joi.string().trim().required(),
    base_price: joi.number().min(0).required(),
    image_url: joi.string().uri().optional(),
    dietary_tag: joi.string().valid('VEG', 'NON_VEG', 'VEGAN', 'GLUTEN_FREE').required(),
    updated_by: joi.string()
});
const toggleStockSchema = joi.object({
    is_available: joi.boolean().required(),
}); 
export function validateCreateMenuItem(req, res, next) {
    const { error } = createMenuItemSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
export function validateUpdateMenuItem(req, res, next) {
    const { error } = updateMenuItemSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}
export function validateToggleStock(req, res, next) {
    const { error } = toggleStockSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}