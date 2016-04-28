import '../helpers'; /* eslint import-order/import-order: [0] */
import test from 'ava';
import request from 'supertest';
import Koa from 'koa';

import * as auth from '~/src/server/core/auth';

let app;

test.before(t => {

  app = new Koa();

  app.use(auth.checkAuth(true));

});

test('Generating a token produces the expected format.', t => {

  t.true(/[a-f0-9]+/.test(auth.getToken({})));

});

test('An undefined API token produces the expected response.', async t => {

  await request(app.listen())
  .get('/')
  .expect(401);

});

test('An invalid API token produces the expected response.', async t => {

  await request(app.listen())
  .get('/')
  .set('Authorization', 'Bearer 1234')
  .expect(403);

});

test('A valid API token produces the expected response.', async t => {

  await request(app.listen())
  .get('/')
  .set('Authorization', `Bearer ${auth.getToken({})}`)
  .expect(404);

});

test('An invalid TOTP is rejected.', async t => {

  t.is(auth.checkCredentials(), false);

});
