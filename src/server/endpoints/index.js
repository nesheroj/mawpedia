import koaRouter from 'koa-router';
import packageInfo from '../../../package';
import * as auth from '../core/auth';
import { validateRequest } from '../core/validation';
import { loginRequest } from '../schemas/';

const router = koaRouter();

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
