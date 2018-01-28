import {switchcase} from 'phunctional';

const KEYS = ['template', 'dest', 'name', 'force', 'yarn', 'git', 'install'];

const ask = (name, message, val) => {
  const type = val === undefined ? 'input' : 'confirm';
  return {name, message, type, default: val};
};

export default function isMissing(argv) {
  const missingKeys = KEYS.filter(key => !new Set(Object.keys(argv)).has(key));

  const out = missingKeys.reduce((acc, key) => {
    return acc.concat(
      switchcase({
        template: ask('template', 'Remote template to clone (user/repo#tag)'),
        dest: ask('dest', 'Directory to create the app'),
        name: ask('name', 'The application\'s name'),
        force: ask('force', 'Enforce `dest` directory; will overwrite!', false),
        yarn: ask('yarn', 'Install with `yarn` instead of `npm`', false),
        git: ask('git', 'Initialize a `git` repository', false),
        install: ask('install', 'Install dependencies', true)
      })({})(key)
    );
  }, []);

  return out;
}
