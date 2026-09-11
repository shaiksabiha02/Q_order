import joi from 'joi';

const itemModifierGroupSchema = joi.object({
    item_id: joi.string().required(),
    group_id: joi.string().required()
});

export function validateItemModifierGroup(req, res, next) {
    const { error } = itemModifierGroupSchema.validate(req.body);
    if (error) {
        return res.status(400).json({message: error.details[0].message});
    }
    next();
}