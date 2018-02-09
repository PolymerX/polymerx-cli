// import getSslCert from '../lib/ssl-cert'; TODO
import asyncCommand from '../lib/async-command';
import {showStats} from './../lib/webpack/log-stats';
import runWebpack from './../lib/webpack/run-webpack';
import getPkg from './../lib/get-pkg';

export default asyncCommand({
  command: 'watch [src]',

  desc: 'Start a development live-reload server.',

  builder: {
    cwd: {
      description: 'A directory to use instead of $PWD.',
      default: '.'
    },
    src: {
      description: 'Entry file (index.js)',
      default: 'src'
    },
    nomodule: {
      description: 'Build ES5 bundle for oldie browsers',
      default: false
    },
    port: {
      description: 'Port to start a server on',
      default: '8080',
      alias: 'p'
    },
    host: {
      description: 'Hostname to start a server on',
      default: '0.0.0.0',
      alias: 'H'
    }
    // TODO
    // https: {
    //   description: 'Use HTTPS?',
    //   type: 'boolean',
    //   default: false
    // },
    // TODO: using the HTML plugin for webpack we can provide a template
    // template: {
    //   description: 'HTML template used by webpack'
    // },
    // TODO: custom config
    // config: {
    //   description: 'Path to custom polymerx.config.js',
    //   alias: 'c'
    // }
  },

  async handler(argv) {
    const pkg = await getPkg(argv.cwd);
    const newArgv = Object.assign({}, argv, {production: false, pkg});

    // TODO: show time for compilation
    const stats = await runWebpack(newArgv);
    showStats(stats);
  }
});
