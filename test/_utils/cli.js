const {resolve} = require('path');
const uuid = require('uuid/v4');
const execa = require('execa');

const CLI = require.resolve('./../../dist/cli');
const NOINSTALL = process.env.SKIP_INSTALL;

const tmpDir = () => resolve(__dirname, '../output', uuid());
const cliPath = cwd => NOINSTALL ? CLI : resolve(cwd, 'node_modules/.bin/polymerx');
const spawnCLI = async (args, cwd) =>
  execa('node', [cliPath(cwd), ...args.filter(Boolean)], {cwd});

const run = (command, args) => {
  return execa(command, args.filter(Boolean), {cwd: resolve(__dirname)})
  .catch(err => {
    console.log(err.toString());
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

const watch = async (appDir, host, port) => {
  console.log('polymerx watch');
  await spawnCLI(['watch', host ? `--host=${host}` : undefined, port ? `-p=${port}` : undefined], appDir);
};

module.exports = {create};
