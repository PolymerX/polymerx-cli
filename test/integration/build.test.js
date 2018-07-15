
import {relative, join} from 'path';

import test from 'ava';
import {create, build} from '../_utils/cli';
import getFiles from '../_utils/get-files';
import snapBuild from '../_utils/snapshots/build';

const isWin = process.platform === 'win32';

test('build a skeleton', async t => {
  const newPath = await create('default', undefined, true);
  await build(newPath);
  const files = await getFiles(join(newPath, 'dist'));

  const precacheFiles = files.filter(item => item.includes('precache'));
  t.true(precacheFiles.length === 2);

  const relativePaths = files
    .filter(item => !item.includes('precache'))
    .map(file => relative(newPath, file))
    .sort();

  t.deepEqual(relativePaths, snapBuild(isWin));
});
