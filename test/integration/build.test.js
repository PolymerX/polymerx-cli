
import {relative, join} from 'path';

import test from 'ava';
import {create, build} from './../_utils/cli';
import getFiles from './../_utils/get-files';
import snapBuild from './../_utils/snapshots/build';

const isWin = process.platform === 'win32';

test('build a skeleton', async t => {
  const newPath = await create('polymer-skeleton', undefined, true);
  await build(newPath);
  const files = await getFiles(join(newPath, 'dist'));
  const relativePaths = files.map(file => relative(newPath, file));
  t.deepEqual(relativePaths, snapBuild(isWin));
});
