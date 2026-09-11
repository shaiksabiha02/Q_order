import Joi from "joi";

const validateAssistance = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().uuid().required(),
        guest_id: Joi.string().uuid().required(),
        table_id: Joi.string().uuid().required(),
        type: Joi.string()
            .valid("WATER", "BILL", "WAITER")
            .required(),
        message: Joi.string().allow("", null)
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

const getAssistanceSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10)
});

export const validateGetAssistance = (req, res, next) => {
    const { error } = getAssistanceSchema.validate(req.query);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateAssistanceId = (req, res, next) => {
    const schema = Joi.object({
        id: Joi.string().uuid().required()
    });

    const { error } = schema.validate(req.params);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export const validateResolveAssistance = (req, res, next) => {
    const schema = Joi.object({
        status: Joi.string()
            .valid("RESOLVED")
            .required()
    });

    const { error } = schema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    next();
};

export default validateAssistance;