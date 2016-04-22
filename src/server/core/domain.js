import cluster from 'cluster';
import domain from 'domain'; /* eslint no-restricted-imports: [0] */

export default function (app) {

  return (req, res, next) => {

    const d = domain.create();

    d.add(req);
    d.add(res);

    d.on('error', err => {

      // log errors
      console.error(err.stack);

      // gracefully refuse requests and close existing before exit
      app.close(() => {

        process.exit(1);
        console.info('Server has been closed');

      });

      // if longer than 20 seconds force exit - doesn't block event loop
      setTimeout(() => {

        process.exit(1);
        console.info('Server has been forced to close');

      }, 20000).unref();

      if (!cluster.worker.suicide) {

        cluster.worker.disconnect();

      }

      next(err);

    });

    d.run(() => {

      next();

    });

  };

}
