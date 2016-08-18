import jsonpack from 'jsonpack';
import base64 from 'base-64';

export function unpackRequest() {

  return async function (ctx, next) {

    if (typeof ctx.request.body === 'string') {

      ctx.request.body = jsonpack.unpack(base64.decode(ctx.request.body));

    }

    await next();

  };

}

export function packResponse() {

  return async function (ctx, next) {

    await next();

    if (ctx.body) {

      ctx.body = base64.encode(jsonpack.pack(ctx.body));
      ctx.type = 'text/plain; charset=utf-8';

    }

  };

}

