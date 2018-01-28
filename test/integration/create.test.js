
import {promisify} from 'util';
import {resolve, relative} from 'path';

import test from 'ava';
import glob from 'glob';
import {create} from './../_utils/cli';
import snapCreate from './../_utils/snapshots/create';

const pGlob = promisify(glob);

const allFiles = (dir, opts) => {
  const ignores = x => !/node_modules|yarn.lock/i.test(x);
  const templatePath = resolve(dir);
  const options = Object.assign({}, opts, {dot: true, nodir: true});
  return pGlob(`${templatePath}/**`, options).then(arr => arr.filter(ignores));
};

test('create a skeleton', async t => {
  const newPath = await create('polymer-skeleton');
  const files = await allFiles(newPath);
  const relativePaths = files.map(file => relative(newPath, file));
  t.deepEqual(relativePaths, snapCreate);
});
