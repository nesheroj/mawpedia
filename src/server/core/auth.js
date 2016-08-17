import jwt from 'jsonwebtoken';
import config from 'config';
import notp from 'notp';

/* istanbul ignore if */
if (!config.has('secret')) {

  throw new Error('Missing JWT secret!');

}

const secret = config.get('secret');
const authenticators = config.get('authenticators') || [];

export function getToken(payload) {

  return jwt.sign(payload, secret);

}

export function checkAuth(force = false) {

  return async function (ctx, next) {

    ctx.state.isAuthorised = false;

    const token = ctx.request.get('Authorization').split(' ')[1];

    if (typeof token === 'undefined' && force) {

      ctx.throw(401, { _errors: ['No credentials were provided.'] });
      return;

    }

    try {

      jwt.verify(token, secret);
      ctx.state.isAuthorised = true;

    } catch (err) {

      if (force) {

        return ctx.throw(403, { _errors: ['Invalid credentials provided.'] });

      }

    }
    await next();

  };

}

export function checkCredentials(token) {

  return authenticators.some(authenticator => notp.totp.verify(token, secret) !== null);

}
