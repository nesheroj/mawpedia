import uuid from 'node-uuid';

export default async function(ctx, next) {

  // set a unique id for request
  ctx.uuid = uuid.v4();
  const label = `${ctx.uuid} ${ctx.method} ${ctx.url}`;

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
