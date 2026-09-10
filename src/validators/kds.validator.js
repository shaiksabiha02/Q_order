import Joi from "joi";


export const getKdsOrdersQuerySchema = Joi.object({
  station_id: Joi.string()
    .valid("Bar", "Grill", "Main")
    .required(),
});


export const updateItemStatusParamsSchema = Joi.object({
  item_id: Joi.string()
    .uuid()
    .required(),
});


export const updateItemStatusBodySchema = Joi.object({
  status: Joi.string()
    .uppercase()
    .valid("PREPARING", "READY")
    .required(),
});


export const kdsSyncQuerySchema = Joi.object({
  last_event_id: Joi.number()
    .integer()
    .min(0)
    .default(0),
});


export const printKotBodySchema = Joi.object({
  order_id: Joi.string()
    .uuid()
    .required(),

  printer_ip: Joi.string()
    .ip()
    .required(),

  raw_bytes: Joi.string()
    .required(),
});