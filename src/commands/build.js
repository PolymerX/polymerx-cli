import {resolve} from 'path';
import rimraf from 'rimraf';
import ora from 'ora';
import promisify from 'pify';
import isDir from './../lib/is-dir';
import getPkg from './../lib/get-pkg';
import error from './../lib/error';
import {showStats, endMessage, endBuildMessage} from './../lib/webpack/log-stats';
import runWebpack from './../lib/webpack/run-webpack';
import asyncCommand from './../lib/async-command';

const pRimRaf = promisify(rimraf);

const mergeAssets = (moduleStats, nomoduleStats) => {
  const moduleAssets = moduleStats.toJson().assets;
  const nomoduleAssets = nomoduleStats.toJson().assets;

  return moduleAssets
    .concat(nomoduleAssets
      .filter(nomodule => !moduleAssets.find(module => nomodule.name === module.name))
    );
};

export default asyncCommand({
  command: 'build [src] [dest]',

  desc: 'Create a production build in build/',

  builder: {
    cwd: {
      description: 'A directory to use instead of $PWD.',
      default: '.'
    },
    src: {
      description: 'Entry file (index.js)',
      default: 'src'
    },
    dest: {
      description: 'Directory root for output',
      default: 'dist'
    },
    workers: {
      description: 'Add a Service Workers to the application.',
      alias: 'w',
      default: true
    },
    clean: {
      description: 'Clear output directory before building.',
      default: true
    },
    json: {
      description: 'Generate build statistics for analysis.',
      default: false
    }
    // TODO
    // template: {
    //   description: 'HTML template used by webpack'
    // },
    // config: {
    //   description: 'Path to custom CLI config.',
    //   alias: 'c'
    // }
  },

  async handler(argv) {
    const spinner = ora({
      text: 'Preparing build things...',
      color: 'magenta'
    }).start();

    const cwd = resolve(argv.cwd);
    const modules = resolve(cwd, 'node_modules');

    if (!isDir(modules)) {
      error('No `node_modules` found! Please run `npm install` before continuing.', spinner);
      return process.exit(1); // eslint-disable-line unicorn/no-process-exit
    }

    if (argv.clean) {
      const dest = resolve(cwd, argv.dest || 'dist');
      await pRimRaf(dest);
    }

    const pkg = await getPkg(argv.cwd);
    const newArgv = Object.assign({}, argv, {production: true, pkg});

    spinner.color = 'yellow';
    spinner.text = 'Running compiler...';

    try {
      const {resModule, resNomodule} = await runWebpack(newArgv);

      endBuildMessage(resModule, 'Module', spinner);
      endBuildMessage(resNomodule, 'NoModule', spinner);

      // Be sure to show errors/warnings if present
      showStats(resModule);
      showStats(resNomodule);

      endMessage(mergeAssets(resModule, resNomodule));
    } catch (err) {
      console.error('\n' + err);
    }

    // if (argv.json) {
    //   await writeJsonStats(stats);
    // }
  }
});
