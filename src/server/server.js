import cluster from 'cluster';
import os from 'os';
import config from 'config';
import Koa from 'koa';
import serve from 'koa-static';
import helmet from 'koa-helmet';
import compress from 'koa-compress';
import send from 'koa-send';
import koaRouter from 'koa-router';
import bodyParser from 'koa-bodyparser';
import webpack from 'webpack';
import packageInfo from '~/package';
import apiRouter from '~/src/server/api/';
import cardsRouter from '~/src/server/api/cards';
// import domain from '~/core/domain';
import profile from '~/src/server/core/profile';
import webpackConfig from '~/webpack.config';

const PORT = Number(config.get('port'));
const maxForks = (config.has('maxForks') && config.get('maxForks')) || Number.MAX_SAFE_INTEGER;

function launchForks(amount) {

  cluster.fork();
  !(--amount) || launchForks(amount);

}

if (maxForks === 1 || cluster.isMaster) {

  if (__DEVELOPMENT__) {

    webpack(webpackConfig).run((err, stats) => {

      err && console.error(err);

    });

  }

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
//   app.use(domain(app));
  app.use(helmet());
//   app.use(cors());
  app.use(compress());
  app.use(bodyParser());
  app.use(serve('static'));

  const router = koaRouter();

  router.use(apiRouter.routes(), apiRouter.allowedMethods());
  router.use(cardsRouter.routes(), cardsRouter.allowedMethods());

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
