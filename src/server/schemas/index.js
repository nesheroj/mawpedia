import Joi from 'joi';

export const loginRequest = Joi.object().keys({
  token: Joi.string().length(6).regex(/^[0-9]{6}$/).required()
});
