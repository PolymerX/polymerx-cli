import {resolve, dirname} from 'path';

import chalk from 'chalk';
import getPort from 'get-port';
import clear from 'console-clear';
import webpack from 'webpack';
import DevServer from 'webpack-dev-server';

import isDir from './../is-dir';

import webpackConfig from './webpack-base.config';

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

      if (stats.hasErrors()) {
        process.stdout.write(chalk.red('Build failed!\n\n'));
      } else {
        process.stdout.write(chalk.green('Compiled successfully!\n\n'));

        if (userPort !== port) {
          process.stdout
            .write(`Port ${chalk.bold(userPort)} is in use, using ${chalk.bold(port)} instead\n\n`);
        }
        process.stdout.write('You can view the application in browser.\n\n');
        process.stdout.write(`${chalk.bold('Local:')}            ${serverAddr}\n`);
        // process.stdout.write(`${chalk.bold('On Your Network:')}  ${localIpAddr}\n`);
      }

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
