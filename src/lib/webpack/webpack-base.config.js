import {resolve, join} from 'path';
import webpack from 'webpack';
import merge from 'webpack-merge';
import WorkboxPlugin from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';

import moduleConf from './webpack-module.config';
import nomoduleConf from './webpack-nomodule.config';

const shared = argv => {
  const {
    isProd,
    src,
    srcDir,
    dest,
    nomodule,
    pkg,
    cwd,
    https
  } = argv;

  const IS_MODULE_BUILD = !nomodule;
  const ENV = isProd ? 'production' : 'development';
  const OUTPUT_PATH = isProd ? resolve(dest || 'dist') : resolve(src || 'src');

  const HOST = process.env.HOST || argv.host;
  const PORT = process.env.PORT || argv.port;
  const FULL_HOST = `http://${HOST}:${PORT}`;
  const ENTRY = isProd ? [resolve(src || 'src')] : [OUTPUT_PATH].concat([
    `webpack-dev-server/client?${FULL_HOST}`,
    'webpack/hot/dev-server'
  ]);

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
    new webpack.DefinePlugin({'process.env': processEnv}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]);

  return {
    entry: ENTRY,
    devtool: isProd ? 'source-map' : 'cheap-module-source-map',
    output: {
      path: OUTPUT_PATH,
      filename: IS_MODULE_BUILD ? 'module.bundle.js' : 'bundle.js'
    },
    resolve: {
      modules: [
        'node_modules',
        resolve(__dirname, '../../../node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        resolve(__dirname, '../../../node_modules'),
        resolve(cwd, 'node_modules')
      ]
    },
    module: {
      rules: [{
        test: /\.html$/,
        use: ['raw-loader']
      },
      {
        test: /\.pcss$/,
        use: ['raw-loader', 'postcss-loader']
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
      port: PORT,
      host: HOST,
      https,
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

export default (argv = {}) =>
  merge(argv.nomodule ? nomoduleConf(argv) : moduleConf(argv), shared(argv));
