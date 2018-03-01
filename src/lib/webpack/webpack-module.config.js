
import {resolve} from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default ({isProd, dest}) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [[
                require.resolve('babel-preset-env'),
                {
                  targets: {browsers: ['last 2 Chrome versions', 'Safari 10']},
                  debug: !isProd
                }
              ]],
              plugins: [
                [require.resolve('babel-plugin-transform-object-rest-spread'), {useBuiltIns: true}]
              ]
            }
          }
        }
      ]
    },
    plugins: isProd ? [
      new CleanWebpackPlugin([resolve(dest || 'dist')], {allowExternal: true, verbose: false})
    ] : []
  };
};
