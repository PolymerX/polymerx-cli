import {resolve} from 'path';
import {writeFile, readFile, unlink} from 'fs';
import promisify from 'pify';
import test from 'ava';
import replaceOwner from './../../dist/lib/replace-owner';

const pWrite = promisify(writeFile);
const pRead = promisify(readFile);
const pUnlink = promisify(unlink);

const pkgPath = resolve(__dirname, '_fixture_package.json');

test.after.always('delete fixture', async () => {
  await pUnlink(pkgPath);
});

test('correctly replace keeps with name and author', async t => {
  const pkgFirst = `
    {
      "name": "test-name",
      "author": "test-author"
    }
  `;
  const pkgResult = `
    {
      "name": "awesome-name",
      "author": "awesome-author"
    }
  `;
  await pWrite(pkgPath, pkgFirst);
  const keeps = [pkgPath];
  await replaceOwner(keeps, 'awesome-name', 'awesome-author');
  const newFile = await pRead(pkgPath, 'utf8');
  t.is(newFile, pkgResult);
});
