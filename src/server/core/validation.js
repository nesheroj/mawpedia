import Joi from 'joi';

export function validateRequest(schema, options = { strict: true, required: true }) {

  return async (ctx, next) => {

    try {

      ctx.request.body = Joi.attempt(ctx.request.body, schema, { stripUnknown: !options.strict });
      return next();

    } catch (err) {

      if (options.required) {

        ctx.throw(400, err);

      } else {

        return next();

      }

    }

  };

}
