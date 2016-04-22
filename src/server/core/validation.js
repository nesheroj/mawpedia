import Joi from 'joi';

export function validateRequest(schema, options = { strict: true, required: true }) {

  return async (ctx, next) => {

    const payload = ctx.request.body;

    if (typeof payload === 'undefined') {

      if (!options.required) {

        ctx.request.body = {};

      } else {

        ctx.throw(400, { _errors: 'No data was sent.' });

      }

      return;

    }

    return new Promise((resolve, reject) => {

      Joi.validate(payload, schema, { stripUnknown: !options.strict }, (err, value) => {

        if (err) {

          ctx.throw(400, { _errors: err });
          reject();

        }

        ctx.request.body = value;
        resolve();

      });

    }).then(() => next());

  };

}
