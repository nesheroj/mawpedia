import '../../helpers'; /* eslint import-order/import-order: [0] */
import test from 'ava';
import { hash, checkAgainst } from '../../../src/server/core/crypto';

test('Hasher only accepts strings as input', async t => {

  t.throws(hash());
  t.throws(hash({}));

});

test('Hashing a password produces the expected format.', async t => {

  t.true(/^[a-f0-9]+#10000#pbkdf2#[a-f0-9]+$/.test(await hash('4p455w0rd')));

});

test('Hashing the same payload twice produces the same result.', async t => {

  const shoudlNotThrow = checkAgainst('4p455w0rd', await hash('4p455w0rd'));
  t.notThrows(shoudlNotThrow);
  const shouldThrow = checkAgainst('4p455w0rd', await hash('4n0th3rp455w0rd'));
  t.throws(shouldThrow);

});
