import Joi from "joi";

const loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required()
});

export const validateLogin = (req, res, next) => {
    const { error, value } =
        loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            message: error.details[0].message
        });
    }

    req.body = value;
    next();
};

export default {
    loginSchema
};