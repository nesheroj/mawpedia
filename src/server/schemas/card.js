import Joi from 'joi';

const code = Joi.string().alphanum().uppercase();
const unsignedInt = Joi.number().integer().min(0);
const illustration = Joi.object().keys({
  code: code.required(),
  artistName: Joi.string().required(),
  note: Joi.string().default('')
});
const cardText = Joi.object().keys({
  type: unsignedInt.required(),
  text: Joi.string().required()
});

export const cardCreateRequest = Joi.object().keys({
  code: code.required(),
  name: Joi.string().required(),
  type: unsignedInt.required(),
  expansion: unsignedInt.required(),
  faction: unsignedInt.required(),
  cost: unsignedInt.default(0),
  strength: unsignedInt.default(0),
  power: unsignedInt.default(0),
  keywords: Joi.array().unique().items(Joi.string()).default([]),
  illustrations: Joi.array().items(illustration).default([]),
  publishDate: Joi.string().default(() => new Date().toISOString().split('T')[0], 'TBD'),
  texts: Joi.array().unique().items(cardText).default([]),
  _created: Joi.string().isoDate().default(() => new Date().toISOString(), 'TBD'),
  _updated: Joi.string().isoDate().default(() => new Date().toISOString(), 'TBD')
});
