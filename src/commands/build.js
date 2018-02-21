import {resolve} from 'path';
import rimraf from 'rimraf';
import promisify from 'pify';
import chalk from 'chalk';
import isDir from './../lib/is-dir';
import getPkg from './../lib/get-pkg';
import {showStats} from './../lib/webpack/log-stats';
import runWebpack from './../lib/webpack/run-webpack';
import asyncCommand from './../lib/async-command';

const pRimRaf = promisify(rimraf);

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
    },
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
    const cwd = resolve(argv.cwd);
    const modules = resolve(cwd, 'node_modules');

    if (!isDir(modules)) {
      chalk.red('No `node_modules` found! Please run `npm install` before continuing.');
      return process.exit(1); // eslint-disable-line unicorn/no-process-exit
    }

    if (argv.clean) {
      const dest = resolve(cwd, argv.dest || 'dist');
      await pRimRaf(dest);
    }

    const pkg = await getPkg(argv.cwd);
    const newArgv = Object.assign({}, argv, {production: true, pkg});

    const stats = await runWebpack(newArgv);
    showStats(stats);

    // if (argv.json) {
    //   await writeJsonStats(stats);
    // }
  }
});
