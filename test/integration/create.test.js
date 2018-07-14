
import {relative} from 'path';

import test from 'ava';
import {create} from '../_utils/cli';
import getFiles from '../_utils/get-files';
import snapCreate from '../_utils/snapshots/create';

const isWin = process.platform === 'win32';

test('create a skeleton', async t => {
  const newPath = await create('default');
  const files = await getFiles(newPath);
  const relativePaths = files.map(file => relative(newPath, file));
  t.deepEqual(relativePaths, snapCreate(isWin));
});
