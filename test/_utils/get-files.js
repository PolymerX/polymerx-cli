const {resolve} = require('path');
const promisify = require('pify');
const glob = require('glob');

const pGlob = promisify(glob);

module.exports = (dir, opts) => {
  const ignores = x => !/node_modules|yarn.lock/i.test(x);
  const templatePath = resolve(dir);
  const options = Object.assign({}, opts, {dot: true, nodir: true});
  return pGlob(`${templatePath}/**`, options).then(arr => arr.filter(ignores));
};
