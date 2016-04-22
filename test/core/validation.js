import { mockContext } from '../helpers';  /* eslint import-order/import-order: [0] */
import test from 'ava';
import Joi from 'joi';
import { validateRequest } from '~/src/server/core/validation';

test('An invalid payload throws.', t => {

  // const context = mockContext();
  // const schema = Joi.object().keys({
  //   token: Joi.string().length(6).regex(/^[0-9]{6}$/).required()
  // });

  // t.throws(validateRequest(schema)(context, () => {}));

});
