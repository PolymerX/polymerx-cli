const {resolve} = require('path');
const execa = require('execa');

const tmpDir = require('./tmp-dir');

const CLI = require.resolve('./../../dist/cli');

const run = (command, args, cwd) => {
  return execa(command, args.filter(Boolean), {cwd: cwd || resolve(__dirname)})
    .catch(error => {
      console.log(error.toString());
      throw error.toString();
    });
};

const create = async (template, name, install) => {
  const dest = tmpDir();
  const args = [CLI, 'create', template, dest, '--name']
    .concat(name || `test-${template}`)
    .concat(install ? ['--install', '--yarn'] : '--no-install');

  console.log(
    'Creating skeleton project for testing...',
    install ? ' \n--install enable, will take few minutes.' : ''
  );
  await run('node', args);
  return dest;
};

const watch = (appDir, host, port) => {
  console.log('polymerx watch');
  const args = [CLI, 'watch']
    .concat(host ? `--host=${host}` : undefined)
    .concat(port ? `-p=${port}` : undefined);
  return run('node', args, appDir).stdout;
};

const build = (appDir, customConf) => {
  const args = [CLI, 'build'].concat(customConf ? `--c=${customConf}` : undefined);
  return run('node', args, appDir);
};

module.exports = {create, watch, build};
