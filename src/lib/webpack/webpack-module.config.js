
import {resolve} from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default ({isProd}) => {
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
                  debug: true
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
      new CleanWebpackPlugin([resolve('dist')], {verbose: true})
    ] : []
  };
};
