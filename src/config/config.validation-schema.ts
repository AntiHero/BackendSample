import Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PASS: Joi.string().required(),
  MAILER_HOST: Joi.string().required(),
  GMAIL_EMAIL: Joi.string().required(),
  GMAIL_PASSWORD: Joi.string().required(),
});
