import '../helpers'; /* eslint import-order/import-order: [0] */
import test from 'ava';
import request from 'supertest';
import Koa from 'koa';

import {
  getToken,
  checkAuth
} from '~/src/server/core/auth';

test('Generating a token produces the expected format.', t => {

  t.true(/[a-f0-9]+/.test(getToken({})));

});

test('An undefined token produces the expected response.', async t => {

  const app = new Koa();

  app.use(checkAuth(true));

  await request(app.listen())
  .get('/')
  .expect(401);

});

test('An invalid token produces the expected response.', async t => {

  const app = new Koa();

  app.use(checkAuth(true));

  await request(app.listen())
  .get('/')
  .set('Authorization', 'Bearer 1234')
  .expect(403);

});

test('A valid token produces the expected response.', async t => {

  const app = new Koa();

  app.use(checkAuth(true));

  await request(app.listen())
  .get('/')
  .set('Authorization', `Bearer ${getToken({})}`)
  .expect(404);

});
