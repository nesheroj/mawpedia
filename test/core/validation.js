import '../helpers';  /* eslint import-order/import-order: [0] */
import test from 'ava';
import Joi from 'joi';
import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { validateRequest } from '~/src/server/core/validation';

const schema = Joi.object().keys({
  foo: Joi.any().valid('bar').required()
});

const passthrough = (ctx, next) => {

  ctx.status = 200;
  ctx.body = ctx.request.body;

};

test('An invalid payload throws.', async t => {

  const app = new Koa();

  app.use(bodyParser());
  app.use(validateRequest(schema));

  await request(app.listen())
  .post('/')
  .send({})
  .expect(400);

});

test('An valid payload passes.', async t => {

  const app = new Koa();

  app.use(bodyParser());
  app.use(validateRequest(schema));
  app.use(passthrough);

  await request(app.listen())
  .post('/')
  .send({ foo: 'bar' })
  .expect(200);

});

test('Can handle optional payloads', async t => {

  const app = new Koa();

  app.use(bodyParser());
  app.use(validateRequest(schema, { required: false }));
  app.use(passthrough);

  await request(app.listen())
  .post('/')
  .expect(200);

});
