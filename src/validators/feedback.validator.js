import Joi from "joi";

const feedbackSchema = Joi.object({
    tenant_id: Joi.string().uuid().required(),
    branch_id: Joi.string().uuid().required(),
    order_id: Joi.string().uuid().required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    comments: Joi.string().allow("", null)
});

export const validateFeedback = (req, res, next) => {
    const { error } = feedbackSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};