import {statSync, existsSync} from 'fs';

export default path =>
  existsSync(path) && statSync(path).isDirectory();
