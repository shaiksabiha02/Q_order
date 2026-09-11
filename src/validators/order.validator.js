import Joi from 'joi';

export const validateSubmitOrder = (req, res, next) => {
  const schema = Joi.object({
    'x-tenant-id': Joi.string().uuid().required(),
    'x-branch-id': Joi.string().uuid().required(),
    'x-idempotency-key': Joi.string().uuid().required(),
    cart_item_id: Joi.string().uuid().required(),
    tax_rate: Joi.number().min(0).optional()
  });

  const dataToValidate = {
    ...req.headers,
    ...req.body
  };

  const { error } = schema.validate(dataToValidate, { allowUnknown: true });

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  next();
};


export const validateSessionHistory = (req, res, next) => {
  const schema = Joi.object({
    'x-tenant-id': Joi.string().uuid().required(),
    'x-branch-id': Joi.string().uuid().required(),
    table_id: Joi.string().uuid().required()
  });

  const { error } = schema.validate({ ...req.headers, ...req.query }, { allowUnknown: true });

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  next();
};

export const validateOrderStatus = (req, res, next) => {
  const schema = Joi.object({
    'x-tenant-id': Joi.string().uuid().required(),
    order_id: Joi.string().uuid().required(),
    status: Joi.string()
      .valid('RECEIVED', 'PREPARING', 'READY', 'SERVED', 'COMPLETED', 'CANCELLED')
      .optional()
  });

  const { error } = schema.validate(
    { ...req.headers, ...req.params, ...req.body },
    { allowUnknown: true }
  );

  if (error) {
    const err = new Error(error.details[0].message);
    err.statusCode = 400;
    return next(err);
  }

  next();
};