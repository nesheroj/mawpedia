import uuid from 'uuid';

export default async function (ctx, next) {

  // set a unique id for request
  ctx.state.uuid = uuid.v4();
  ctx.state.realm = ctx.host.split('.')[0];
  const label = `${ctx.state.uuid} ${ctx.method} ${ctx.url}`;

  // Profile response
  console.time(label);
  await next();

  console.timeEnd(label);
  console.log(JSON.stringify({
    status: ctx.statusCode,
    path: ctx.path,
    query: ctx.query,
    params: ctx.params
  }));

}
