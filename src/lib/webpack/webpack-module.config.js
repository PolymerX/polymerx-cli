
import {resolve} from 'path';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default ({isProd}) => {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          // We need to transpile Polymer itself and other ES6 code
          // exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [[
                'env',
                {
                  targets: {browsers: ['last 2 Chrome versions', 'Safari 10']},
                  debug: true
                }
              ]],
              plugins: [['transform-object-rest-spread', {useBuiltIns: true}]]
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
