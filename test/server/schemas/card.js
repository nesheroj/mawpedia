import test from 'ava';
import request from 'supertest';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { validateRequest } from '../../../src/server/core/validation';
import { cardCreateRequest } from '../../../src/server/schemas/card';
import createCardFixture from './fixtures/card';

const passthrough = (ctx, next) => {

  ctx.status = 200;
  ctx.body = ctx.request.body;

};

test('Can create a card.', async t => {

  const app = new Koa();

  app.use(bodyParser());
  app.use(validateRequest(cardCreateRequest, { strict: true, required: true }));
  app.use(passthrough);

  await request(app.listen())
  .post('/')
  .send(createCardFixture)
  .expect(200);

});
