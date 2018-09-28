const {resolve} = require('path');
const promisify = require('pify');
const glob = require('glob');

const pGlob = promisify(glob);

module.exports = async (dir, opts) => {
  const ignores = x => !/node_modules|yarn.lock/i.test(x);
  const templatePath = resolve(dir);
  const options = {...opts, dot: true, nodir: true};
  const arr = await pGlob(`${templatePath}/**`, options);
  return arr.filter(ignores);
};
