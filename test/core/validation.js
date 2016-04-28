import '../helpers';  /* eslint import-order/import-order: [0] */
import test from 'ava';
import Joi from 'joi';
import request from 'supertest';
import Koa from 'koa';
import { validateRequest } from '~/src/server/core/validation';

test('An invalid payload throws.', async t => {

  const app = new Koa();

  const schema = Joi.object().keys({
    token: Joi.string().length(6).regex(/^[0-9]{6}$/).required()
  });

  app.use(validateRequest(schema));

  await request(app.listen())
  .get('/')
  .expect(400);

});
