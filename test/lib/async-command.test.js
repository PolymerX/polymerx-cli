import test from 'ava';
import asyncCommand from '../../dist/lib/async-command';

const mockHandler = () => Promise.resolve('Nice');

test('running asyncCommand (no handler)', t => {
  const res = asyncCommand({template: 'test'});
  const handlerRes = res.handler({});
  t.is(res.template, 'test');
  t.is(handlerRes, undefined);
});

test('running asyncCommand (with handler func)', async t => {
  const res = asyncCommand({
    template: 'test',
    handler: mockHandler
  });

  const handlerRes = await res.handler({test: 'nothing'});
  t.is(res.template, 'test');
  t.true(handlerRes);
});
