import chalk from 'chalk';
import asyncCommand from '../lib/async-command';
import runWebpack from './../lib/webpack/run-webpack';
import getPkg from './../lib/get-pkg';
import getSSLCert from './../lib/ssl-cert';

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
      type: 'boolean',
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
    },
    https: {
      description: 'Use HTTPS?',
      type: 'boolean',
      default: false
    }
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
    if (argv.https || process.env.HTTPS) {
      const ssl = await getSSLCert() || true;
      argv.https = ssl;
    }

    if (argv.https === true) {
      console.log(chalk.yellow('Reverting to `webpack-dev-server` internal certificate.'));
    }

    const newArgv = Object.assign({}, argv, {production: false, pkg});

    // TODO: show time for compilation
    await runWebpack(newArgv);
  }
});
