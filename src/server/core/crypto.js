import crypto from 'crypto';

const iterations = 10000;
const method = 'pbkdf2';

export function hash(payload) {

  if (typeof payload !== 'string') {

    return Promise.reject(new Error('Invalid payload'));

  }

  return new Promise((resolve, reject) => {

    crypto.randomBytes(64, (err, generatedSalt) => {

      /* istanbul ignore if */
      if (err) {

        return Promise.reject(err);

      }

      crypto[method](payload, generatedSalt, iterations, 64, (err, hashedPayloadBuffer) => {

        /* istanbul ignore if */
        if (err) {

          return Promise.reject(err);

        }

        resolve([hashedPayloadBuffer.toString('hex'), iterations, method, generatedSalt.toString('hex')].join('#'));

      });

    });

  });

}

export function checkAgainst(sourcePayload, targetHash) {

  const [hashedTarget, targetIterations, targetMethod, targetSalt] = targetHash.split('#');

  return new Promise((resolve, reject) => {

    crypto[targetMethod](sourcePayload, new Buffer(targetSalt, 'hex'), Number(targetIterations), 64, (err, hashedSourceBuffer) => {

      /* istanbul ignore if */
      if (err) {

        return Promise.reject(err);

      }

      if (hashedSourceBuffer.toString('hex') === hashedTarget) {

        resolve();

      } else {

        reject(new Error('Hashes do not match'));

      }

    });

  });

}
