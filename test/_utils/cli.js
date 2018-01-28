const {resolve} = require('path');
const uuid = require('uuid/v4');
const crossSpawn = require('cross-spawn-promise');

const CLI = require.resolve('./../../dist/cli');

const tmpDir = () => resolve(__dirname, '../output', uuid());

const run = (command, args) => {
  return crossSpawn(command, args.filter(Boolean), {cwd: resolve(__dirname)})
  .catch(err => {
    throw err.toString();
  });
};

const create = (template, name) => {
  const dest = tmpDir();
  const args = [CLI, 'create', template, dest, '--name']
    .concat(name || `test-${template}`)
    .concat('--no-install');

  return run('node', args).then(() => dest);
};

module.exports = {create};
