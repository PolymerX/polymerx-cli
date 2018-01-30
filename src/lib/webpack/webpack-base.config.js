import {resolve, join} from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import moduleConf from './webpack-module.config';
import nomoduleConf from './webpack-nomodule.config';

const shared = env => {
  const {
    isProd,
    src,
    srcDir,
    nomodule,
    pkg,
    cwd
  } = env;

  const IS_MODULE_BUILD = !nomodule;
  const ENV = isProd ? 'production' : 'development';
  const OUTPUT_PATH = isProd ? resolve('dist') : resolve(src || 'src');

  const processEnv = {
    NODE_ENV: JSON.stringify(ENV),
    appVersion: JSON.stringify(pkg.version)
  };

  /**
   * === Copy static files configuration
   */
  const copyStatics = {
    copyWebcomponents: [{
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-loader.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-lite.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-hi-sd-ce.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }],
    copyOthers: [{
      from: 'assets/**',
      context: resolve(srcDir),
      to: OUTPUT_PATH
    }, {
      from: resolve(srcDir, 'index.html'),
      to: OUTPUT_PATH,
      flatten: true
    }, {
      from: resolve(srcDir, 'manifest.json'),
      to: OUTPUT_PATH,
      flatten: true
    }]
  };

  /**
   * Plugin configuration
   */
  const plugins = [].concat(isProd ? [
    new WorkboxPlugin({
      globDirectory: OUTPUT_PATH,
      globPatterns: ['**/!(*map*)'],
      globIgnores: ['**/sw.js'],
      swDest: join(OUTPUT_PATH, 'sw.js')
    }),
    new CopyWebpackPlugin(
      [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers)
    )
  ] : [new CopyWebpackPlugin(copyStatics.copyWebcomponents)]).concat([
    new webpack.DefinePlugin({'process.env': processEnv})
  ]);

  const entry = isProd ? [src] : [src].concat([
    'webpack-dev-server/client',
    'webpack/hot/dev-server'
  ]);

  return {
    entry,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    output: {
      path: OUTPUT_PATH,
      filename: IS_MODULE_BUILD ? 'module.bundle.js' : 'bundle.js'
    },
    module: {
      rules: [{
        test: /\.html$/,
        use: ['text-loader']
      },
      {
        test: /\.pcss$/,
        use: ['text-loader', 'postcss-loader']
      }]
    },
    plugins,
    devServer: {
      hot: true,
      compress: true,
      contentBase: OUTPUT_PATH,
      overlay: {
        errors: true
      },
      stats: 'minimal',
      port: process.env.PORT || env.port || 3000,
      host: process.env.HOST || env.host || '0.0.0.0',
      disableHostCheck: true,
      historyApiFallback: true,
      quiet: true,
      clientLogLevel: 'none',
      watchOptions: {
        ignored: [
          resolve(cwd, 'dist'),
          resolve(cwd, 'node_modules')
        ]
      }
    }
  };
};

export default (env = {}) =>
  merge(env.nomodule ? nomoduleConf(env) : moduleConf(env), shared(env));
