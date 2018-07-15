import test from 'ava';

import snapIsMissing from '../_utils/snapshots/is-missing';
import isMissing from '../../dist/lib/is-missing';

test('all missing (except "template")', t => {
  const res = isMissing({template: 'test'});
  const snap = snapIsMissing(['template']);
  t.deepEqual(res, snap);
});

test('all missing (except "git")', t => {
  const res = isMissing({name: 'test', git: false});
  const snap = snapIsMissing(['git']);
  t.deepEqual(res, snap);
});
