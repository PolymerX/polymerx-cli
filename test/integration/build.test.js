
import {join, relative} from 'path';
import {readFile} from 'fs';

import test from 'ava';
import pify from 'pify';
import {build, create} from '../_utils/cli';
import getFiles from '../_utils/get-files';
import {customWebpack, snapBuild} from '../_utils/snapshots/build';
import fromSubject from '../_utils/from-subject';

const isWin = process.platform === 'win32';
const pReadFile = pify(readFile);

test('build a skeleton', async t => {
  const newPath = await create('default', undefined, true);
  await build(newPath);
  const files = await getFiles(join(newPath, 'dist'));

  const precacheFiles = files.filter(item => item.includes('precache'));
  t.true(precacheFiles.length === 1);

  const relativePaths = files
    .filter(item => !item.includes('precache'))
    .map(file => relative(newPath, file))
    .sort();

  t.deepEqual(relativePaths, snapBuild(isWin));
});

test('build with custom polymerx.config.js', async t => {
  const newPath = await create('default', 'custom-webpack', true);
  await fromSubject('custom-webpack', newPath);
  await build(newPath, './polymerx.config.js');

  const file = join(newPath, 'dist/index.html');
  const html = await pReadFile(file, 'utf-8');

  t.deepEqual(html, customWebpack);
});
