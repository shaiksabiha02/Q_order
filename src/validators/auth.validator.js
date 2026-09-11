import Joi from "joi";

const staffLoginSchema = Joi.object({
    username: Joi.string()
        .trim()
        .required(),

    pin: Joi.string()
        .trim()
        .required(),
});

export const validateStaffLogin = (req, res, next) => {
    const { error } = staffLoginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

const refreshTokenSchema = Joi.object({
    refresh_token: Joi.string()
        .trim()
        .required(),
});

export const validateRefreshToken = (req, res, next) => {
    const { error } = refreshTokenSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};

const logoutSchema = Joi.object({
    refresh_token: Joi.string()
        .trim()
        .required(),
});

export const validateLogout = (req, res, next) => {
    const { error } = logoutSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};