import '../../helpers'; /* eslint import-order/import-order: [0] */
import test from 'ava';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import request from 'supertest';
import jsdom from 'jsdom';
import jsonpack from 'jsonpack';
import { packResponse, unpackRequest } from '../../../src/server/core/compression';

test('Payload stays equal after packing and unpacking', async t => {

  const payload = { foo: 'bar' };

  const window = await (new Promise((resolve, reject) => jsdom.env('<span>foo</span>', (err, window) => err ? reject(err) : resolve(window))));

  const unpackResponse = response => jsonpack.unpack(window.atob(response));

  const packRequest = request => window.btoa(jsonpack.pack(request));

  const app = new Koa();

  app.use(bodyParser({ enableTypes: ['text'], extendTypes: { text: ['text/plain'] } }));
  app.use(unpackRequest());
  app.use(packResponse());
  app.use((ctx, next) => {

    ctx.status = 200;
    ctx.body = Object.assign({}, ctx.request.body);

  });

  const response = await request(app.listen())
  .post('/')
  .set('Content-Type', 'text/plain')
  .send(packRequest(payload))
  .expect(200);

  t.deepEqual(unpackResponse(response.text), payload);

});
