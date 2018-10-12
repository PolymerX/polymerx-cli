const {resolve} = require('path');

const ncp = require('ncp');
const pify = require('pify');

const copy = pify(ncp);
const subjects = resolve(__dirname, 'subjects');

module.exports = async (name, dest) => {
  const dir = resolve(subjects, name);

  console.log(`Copy subject: ${name}`);
  await copy(dir, dest);

  return dest;
};
