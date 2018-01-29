
import {resolve, relative} from 'path';
import promisify from 'pify';

import test from 'ava';
import glob from 'glob';
import {create} from './../_utils/cli';
import snapCreate from './../_utils/snapshots/create';

const pGlob = promisify(glob);
const isWin = process.platform === 'win32';

const allFiles = (dir, opts) => {
  const ignores = x => !/node_modules|yarn.lock/i.test(x);
  const templatePath = resolve(dir);
  const options = Object.assign({}, opts, {dot: true, nodir: true});
  return pGlob(`${templatePath}/**`, options).then(arr => arr.filter(ignores));
};

test('create a skeleton', async t => {
  const newPath = await create('polymer-skeleton');
  console.log('<<<<< Skeleton created >>>>>');
  const files = await allFiles(newPath);
  const relativePaths = files.map(file => relative(newPath, file));
  t.deepEqual(relativePaths, snapCreate(isWin));
});
