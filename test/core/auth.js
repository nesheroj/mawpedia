import '../helpers'; /* eslint import-order/import-order: [0] */
import test from 'ava';
import {
  getToken
  // checkAuth
} from '~/src/server/core/auth';

test('Generating a token produces the expected format.', t => {

  t.true(/[a-f0-9]+/.test(getToken({})));

});

// test('An undefined token produces the expected response.', t => {

//   return new Promise((resolve, reject) => {

//     checkAuth(mockContext(), () => resolve());
//     reject();

//   });

// });

// test.cb('An invalid token produces the expected response.', t => {

//   const context = mockContext();

//   context.request.header.token = '';

//   t.throws(checkAuth(context, () => t.end(true)));
//   t.end();

// });

// test.cb('A valid token produces the expected response.', t => {

//   const context = mockContext();

//   context.request.header.token = getToken({});

//   checkAuth(context, () => t.end());

// });
