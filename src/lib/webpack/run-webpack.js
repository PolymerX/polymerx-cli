import {resolve, dirname} from 'path';

import chalk from 'chalk';
import getPort from 'get-port';
import clear from 'console-clear';
import webpack from 'webpack';
import DevServer from 'webpack-dev-server';

import isDir from './../is-dir';

import webpackConfig from './webpack-base.config';

const log = msg => process.stdout.write(msg);

const endMessage = stats =>
  stats.hasErrors() ?
    log(chalk.red('\n\nBuild failed!\n\n')) :
    log(chalk.green('\n\nCompiled successfully!\n\n'));

const detailMessage = (port, userPort, serverAddr) => {
  if (port !== userPort) {
    log(`Port ${chalk.bold(userPort)} is in use, using ${chalk.bold(port)} instead\n\n`);
  }

  log('You can view the application in browser.\n\n');
  log(`${chalk.bold('Local:')} ${serverAddr}\n`);
};

const devBuild = async (env, onprogress) => {
  const config = webpackConfig(env);

  const userPort = parseInt(process.env.PORT || config.devServer.port, 10) || 8080;
  const port = await getPort(userPort);
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.plugin('done', stats => {
      const devServer = config.devServer;
      const protocol = (process.env.HTTPS || devServer.https) ? 'https' : 'http';

      const userHost = process.env.HOST || devServer.host || 'localhost';
      const host = userHost === '0.0.0.0' ? 'localhost' : userHost;

      const serverAddr = `${protocol}://${host}:${chalk.bold(port)}`;
      // const localIpAddr = `${protocol}://${ip.address()}:${chalk.bold(port)}`;

      clear();
      endMessage(stats);
      detailMessage(port, userPort, serverAddr);


      if (onprogress) {
        onprogress(stats);
      }
    });

    compiler.plugin('failed', reject);

    new DevServer(compiler, config.devServer).listen(port);
  });
};

const prodBuild = () => {
  console.log('Nothing here');
};

export default (env, onprogress) => {
  // env.src='src' via `build` default
  const cwd = resolve(env.cwd || process.cwd());
  const src = resolve(cwd, env.src);
  const srcDir = isDir(src) ? src : dirname(src);
  const watch = env.watch;

  const newEnv = Object.assign({}, env, {
    isProd: env.production,
    cwd,
    src,
    srcDir
  });

  const fn = watch ? devBuild : prodBuild;
  return fn(newEnv, onprogress);
};
