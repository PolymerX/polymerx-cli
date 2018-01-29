import {resolve} from 'path';
import {readFile} from 'fs';

import promisify from 'pify';
// import getSslCert from '../lib/ssl-cert';
import asyncCommand from '../lib/async-command';
import showStats from './../lib/webpack/show-stats';
import runWebpack from './../lib/webpack/run-webpack';

const pRead = promisify(readFile);

const getPkg = async cwd => {
  const pkgFile = resolve(cwd, 'package.json');
  return pkgFile ? JSON.parse(await pRead(pkgFile, 'utf8')) : {};
};

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
      description: 'Build ES5 bundle for old browsers',
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
    },
    template: {
      description: 'HTML template used by webpack'
    },
    config: {
      description: 'Path to custom polymerx.config.js',
      alias: 'c'
    }
  },

  async handler(argv) {
    const pkg = await getPkg(argv.cwd);
    const newArgv = Object.assign({}, argv, {production: false, watch: true, pkg});

    // if (argv.https || process.env.HTTPS) {
    //   let ssl = await getSslCert();
    //   if (!ssl) {
    //     ssl = true;
    //     warn('Reverting to `webpack-dev-server` internal certificate.');
    //   }
    //   argv.https = ssl;
    // }

    const stats = await runWebpack(newArgv, showStats);
    // showStats(stats);
  }
});
