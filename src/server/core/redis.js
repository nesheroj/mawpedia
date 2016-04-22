import Redis from 'ioredis';
import config from 'config';

let redis;

function initialise() {

  if (!redis) {

    redis = new Redis({ showFriendlyErrorStack: __DEVELOPMENT__, db: config.get('dbindex') });

    redis
      .on('connect', () => {

        console.info('Redis is connecting');

      })
      .on('reconnected', () => {

        console.info('Redis has reconnected');

      })
      .on('ready', () => {

        console.info('Redis is connected');

      })
      .on('closed', () => {

        console.info('Redis has closed connection');

      })
      .on('end', () => {

        console.info('Redis has ended connections');

      })
      .on('error', console.error);

  }

}

export function getUnderlying() {

  initialise();
  return redis;

}

export function findOne(identity) {

  initialise();

  return redis.get(identity)
    .then(result => result === null ? Promise.reject(new Error(`Entry not found: ${identity}`)) : result);

}

export function scan(params) {

  initialise();
  return new Promise((resolve, reject) => {

    const stream = redis.scanStream(params);
    const keys = [];
    stream.on('data', resultKeys => {

      resultKeys.forEach(resultKey => keys.push(resultKey));

    });
    stream.on('end', () => {

      Promise.all(keys.map(key => redis.get(key)))
      .then(result => resolve(result))
      .catch(err => reject(err));

    });

  });

}

export function upsert(key, value) {

  initialise();

  return value ? redis.set(key, value) : Promise.reject();

}
