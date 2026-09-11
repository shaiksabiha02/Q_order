import joi from 'joi';
const createCategorySchema = joi.object({
    tenant_id: joi.string().required(),
    branch_id: joi.string().required(),
    name: joi.string().required(),
});
export function validateCreateCategory(req, res, next) {
    const { error } = createCategorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}