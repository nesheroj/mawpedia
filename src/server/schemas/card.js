import Joi from 'joi';

const code = Joi.string().regex(/^[a-zA-Z0-9\-]{4,}$/).uppercase();
const unsignedInt = Joi.number().integer().min(0);
const illustration = Joi.object().keys({
  code: code.required(),
  artistName: Joi.string().required(),
  note: Joi.string().allow('').required()
});

export const cardCreateRequest = Joi.object().keys({
  code: code.required(),
  name: Joi.string().required(),
  type: unsignedInt.required(),
  expansion: unsignedInt.required(),
  faction: unsignedInt.required(),
  cost: Joi.number().integer().default(0),
  strength: Joi.number().integer().default(0),
  power: Joi.number().integer().default(0),
  keywords: Joi.array().unique().items(Joi.string()).default([]),
  defaultIllustration: unsignedInt.default(0),
  illustrations: Joi.array().items(illustration).default([]),
  publishDate: Joi.string().default(() => new Date().toISOString().split('T')[0], 'TBD'),
  texts: Joi.object().pattern(/^[$A-Z_][0-9A-Z_$]*$/i, Joi.array().items(Joi.string()).default([])),
  _created: Joi.string().isoDate().default(() => new Date().toISOString(), 'TBD'),
  _updated: Joi.string().isoDate().default(() => new Date().toISOString(), 'TBD')
});
