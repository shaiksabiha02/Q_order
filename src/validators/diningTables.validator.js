import Joi from "joi";

const tableIdSchema = Joi.object({
    id: Joi.string()
        .trim()
        .required(),
});

export const validateTableId = (req, res, next) => {
    const { error } = tableIdSchema.validate(req.params);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};