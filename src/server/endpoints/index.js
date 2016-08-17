import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import { packResponse, unpackRequest } from '~/src/server/core/compression';
import packageInfo from '~/package';
import * as auth from '~/src/server/core/auth';
import { validateRequest } from '~/src/server/core/validation';
import { loginRequest } from '~/src/server/schemas/';

const router = koaRouter({ prefix: '/api' });

router.use(bodyParser({ enableTypes: ['text'], extendTypes: { text: ['text/plain'] } }), unpackRequest(), packResponse());

router.get('/', (ctx, next) => {

  ctx.body = { version: packageInfo.version };

});

router.post('/login', validateRequest(loginRequest), (ctx, next) => {

  const loginRequest = ctx.request.body;

  if (auth.checkCredentials(loginRequest.token)) {

    const tokenPayload = {
      sessid: ctx.uuid
    };

    ctx.body = {
      token: auth.getToken(tokenPayload)
    };

  } else {

    ctx.status = 403;
    ctx.body = { _errors: ['Invalid credentials.'] };

  }

});

export default router;
