import {resolve, join} from 'path';
import findNodeModules from 'find-node-modules';
import webpack from 'webpack';
import merge from 'webpack-merge';
import {GenerateSW} from 'workbox-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackExcludeAssetsPlugin from 'html-webpack-exclude-assets-plugin';
import ScriptExtHtmlWebpackPlugin from 'script-ext-html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

const renderHtmlPlugins = (outputPath, isProd, src) =>
  [
    new HtmlWebpackPlugin({
      filename: resolve(outputPath, 'index.html'),
      template: `!!ejs-loader!${resolve(src, 'index.html')}`,
      minify: isProd && {
        collapseWhitespace: true,
        removeScriptTypeAttributes: true,
        removeRedundantAttributes: true,
        removeStyleLinkTypeAttributes: true,
        removeComments: true
      },
      inject: true,
      compile: true,
      excludeAssets: [/(bundle|polyfills)(\..*)?\.js$/],
      paths: {
        webcomponents: './vendor/webcomponents-loader.js'
      }
    }),
    new HtmlWebpackExcludeAssetsPlugin(),
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'defer'
    })
  ];

const shared = argv => {
  const {
    isProd,
    src,
    srcDir,
    dest,
    pkg,
    cwd,
    https,
    workers
  } = argv;

  const ENV = isProd ? 'production' : 'development';
  const OUTPUT_PATH = isProd ? resolve(dest || 'dist') : resolve(src || 'src');
  const NODE_MODULES = findNodeModules({cwd, relative: false});

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
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/webcomponents-bundle.js'),
      to: join(OUTPUT_PATH, 'vendor'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-ce.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd-ce-pf.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
      flatten: true
    }, {
      from: resolve('./node_modules/@webcomponents/webcomponentsjs/bundles/webcomponents-sd.js'),
      to: join(OUTPUT_PATH, 'vendor', 'bundles'),
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
  const sharedPlugins = [
    new webpack.DefinePlugin({'process.env': processEnv}),
    ...renderHtmlPlugins(OUTPUT_PATH, isProd, src)
  ];

  const devPlugins = [
    new CopyWebpackPlugin(copyStatics.copyWebcomponents),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ];

  const buildPlugins = [
    new CleanWebpackPlugin([resolve(OUTPUT_PATH)], {
      allowExternal: true, verbose: false
    }),
    new CopyWebpackPlugin(
      [].concat(copyStatics.copyWebcomponents, copyStatics.copyOthers)
    )
  ].concat(workers ? new GenerateSW({
    swDest: join(OUTPUT_PATH, 'sw.js'),
    skipWaiting: true
  }) : []);

  const plugins = sharedPlugins.concat(isProd ? buildPlugins : devPlugins);

  return {
    mode: ENV,
    entry: ENTRY,
    output: {
      path: OUTPUT_PATH,
      filename: 'bundle.js'
    },
    devtool: 'cheap-source-map',
    resolve: {
      modules: [
        ...NODE_MODULES,
        resolve(__dirname, '../../../node_modules')
      ]
    },
    resolveLoader: {
      modules: [
        ...NODE_MODULES,
        resolve(__dirname, '../../../node_modules')
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
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [[
              require.resolve('@babel/preset-env'),
              {
                targets: {
                  browsers: [
                    // Best practice: https://github.com/babel/babel/issues/7789
                    '>=1%',
                    'not ie 11',
                    'not op_mini all'
                  ]
                },
                debug: !isProd
              }
            ]],
            plugins: [
              [require.resolve('@babel/plugin-syntax-object-rest-spread'), {useBuiltIns: true}],
              [require.resolve('@babel/plugin-syntax-dynamic-import')]
            ]
          }
        }
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
  // TODO: ready for custom conf to be merged
  merge(shared(argv));
