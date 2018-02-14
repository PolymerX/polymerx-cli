const {resolve} = require('path');
const uuid = require('uuid/v4');
const execa = require('execa');

const CLI = require.resolve('./../../dist/cli');

const tmpDir = () => resolve(__dirname, '../output', uuid());
const isWin = process.platform === 'win32';

const run = (command, args, cwd) => {
  return execa(command, args.filter(Boolean), {cwd: cwd || resolve(__dirname)})
  .catch(err => {
    console.log(err.toString());
    throw err.toString();
  });
};

const create = (template, name, install) => {
  const dest = tmpDir();
  const args = [CLI, 'create', template, dest, '--name']
    .concat(name || `test-${template}`)
    .concat(install ? ['--install', isWin ? '--npm' : '--yarn'] : '--no-install');

  console.log(
    'Creating skeleton project for testing...',
    install ? ' \n--install enable, will take few minutes.' : ''
  );
  return run('node', args).then(() => dest);
};

const watch = (appDir, host, port) => {
  console.log('polymerx watch');
  const args = [CLI, 'watch']
    .concat(host ? `--host=${host}` : undefined)
    .concat(port ? `-p=${port}` : undefined);
  return run('node', args, appDir).stdout;
};

module.exports = {create, watch};
