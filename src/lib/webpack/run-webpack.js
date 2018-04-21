import {resolve, dirname} from 'path';

import chalk from 'chalk';
import getPort from 'get-port';
import clear from 'console-clear';
import webpack from 'webpack';
import DevServer from 'webpack-dev-server';

import isDir from './../is-dir';
import {endMessage, detailMessage, showStats} from './log-stats';

import webpackConfig from './webpack-base.config';

const runProdCompiler = (compiler, type) => {
  return new Promise((resolve, reject) =>
    compiler.run(async (err, stats) => {
      // On stats error/warnings
      showStats(stats);

      // On compiler error
      if (err || (stats && stats.hasErrors())) {
        reject(chalk.red(`${type} build failed! ${err}`));
      }

      // Timeout for plugins that work on `after-emit` event of webpack
      // On done with success
      await new Promise(resolve => setTimeout(resolve, 20));
      resolve(stats);
    })
  );
};

const devBuild = async argv => {
  const config = webpackConfig(argv);
  const userPort = Number(process.env.PORT || config.devServer.port) || 8080;
  const port = await getPort(userPort);
  const compiler = webpack(config);

  return new Promise((resolve, reject) => {
    compiler.plugin('done', stats => {
      const {devServer} = config;
      const protocol = (process.env.HTTPS || devServer.https) ? 'https' : 'http';
      const userHost = process.env.HOST || devServer.host || 'localhost';
      const host = userHost === '0.0.0.0' ? 'localhost' : userHost;
      const serverAddr = `${protocol}://${host}:${chalk.bold(port)}`;
      // TODO: get local ip
      // const localIpAddr = `${protocol}://${ip.address()}:${chalk.bold(port)}`;

      clear();
      endMessage(stats.toJson().assets, stats.hasErrors());
      detailMessage(stats.hasErrors(), {
        port,
        userPort,
        serverAddr,
        nomodule: argv.nomodule,
        assets: stats.toJson({assets: true}).assets
      });
      showStats(stats);
    });

    compiler.plugin('failed', reject);
    new DevServer(compiler, config.devServer).listen(port);
  });
};

const prodBuild = async argv => {
  const configModule = webpackConfig(argv);
  const configNoModule = webpackConfig(Object.assign({}, argv, {nomodule: true}));
  const compilerModule = webpack(configModule);
  const compilerNoModule = webpack(configNoModule);

  const resModule = await runProdCompiler(compilerModule, 'module');
  const resNomodule = await runProdCompiler(compilerNoModule, 'no-module');
  return {resModule, resNomodule};
};

export default argv => {
  const cwd = resolve(argv.cwd || process.cwd());

  // src provided could be a file or a dir, so switch it up
  const src = resolve(cwd, argv.src);
  const srcDir = isDir(src) ? src : dirname(src);

  const newArgv = Object.assign({}, argv, {
    isProd: argv.production,
    cwd,
    src,
    srcDir,
    nomodule: argv.nomodule
  });

  const fn = argv.production ? prodBuild : devBuild;
  return fn(newArgv);
};
