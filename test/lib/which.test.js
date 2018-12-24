import test from 'ava';
import which from '../../dist/lib/which';

test('correctly check that yarn exist', async t => {
  const res = await which('yarn');
  t.true(res);
});

test('correctly throws when check for "nothing"', async t => {
  const err = await t.throws(() => which('nothing'));
  t.is(err.message, 'not found: nothing');
});
