import {resolve} from 'path';
import {readFile} from 'fs';

import promisify from 'pify';

const pRead = promisify(readFile);

export default async cwd => {
  const pkgFile = resolve(cwd, 'package.json');
  return pkgFile ? JSON.parse(await pRead(pkgFile, 'utf8')) : {};
};
