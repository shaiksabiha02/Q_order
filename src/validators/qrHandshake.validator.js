import Joi from "joi";

const qrHandshakeSchema = Joi.object({
    qr_token: Joi.string()
        .trim()
        .required(),
});

export const validateQrHandshake = (req, res, next) => {
    const { error } = qrHandshakeSchema.validate(req.body);

    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message,
        });
    }

    next();
};