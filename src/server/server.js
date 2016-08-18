import cluster from 'cluster';
import os from 'os';
import path from 'path';
import config from 'config';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import send from 'koa-send';
import favicon from 'koa-favicon';
import koaRouter from 'koa-router';
import webpack from 'webpack';
import bodyParser from 'koa-bodyparser';
import { packResponse, unpackRequest } from '~/src/server/core/compression';
import packageInfo from '~/package';
import apiRouter from '~/src/server/endpoints/';
import cardsRouter from '~/src/server/endpoints/cards';
import profile from '~/src/server/core/profile';
import webpackConfig from '~/webpack.config';

const PORT = Number(config.get('port'));
const maxForks = (config.has('maxForks') && config.get('maxForks')) || Number.MAX_SAFE_INTEGER;

function launchForks(amount) {

  cluster.fork();
  !--amount || launchForks(amount);

}

if (maxForks === 1 || cluster.isMaster) {

  webpack(webpackConfig).run((err, stats) => {

    err && console.error(err);
    console.log(stats.toString({ colors: true, chunkModules: false }));

  });

  if (maxForks > 1) {

    // Fork workers.
    launchForks(Math.min(os.cpus().length, maxForks));

  }

  cluster.on('exit', (worker, code, signal) => {

    console.warn(`[${packageInfo.name}] ⚠️ Server worker ${worker.process.pid} died! Restarting...`);

  });

  console.info(`[${packageInfo.name} v${packageInfo.version}]  Server is starting on port ${PORT}.`);

}

if (maxForks === 1 || !cluster.isMaster) {

  // Cluster is not master

  const app = new Koa();

  app.use(profile);
  app.use(helmet());
  app.use(compress());
  app.use(favicon(path.resolve('static/favicon.ico')));
  app.use(serve('static'));

  const router = koaRouter({ prefix: '/api' });

  router.use(bodyParser({ enableTypes: ['text'], extendTypes: { text: ['text/plain'] } }), unpackRequest(), packResponse());
  router.use(cardsRouter.routes(), cardsRouter.allowedMethods());
  router.use(apiRouter.routes(), apiRouter.allowedMethods());

  app.use(router.routes());
  app.use(router.allowedMethods());

  app.use((ctx, next) => send(ctx, 'index.html', { root: 'static' }));

  // Start express listener

  app.listen(PORT, err => {

    if (err) {

      console.error(err);

    }

    console.info(`[${packageInfo.name} v${packageInfo.version}] 🐐  Server worker ${process.pid} is now serving.`);

  });

}
