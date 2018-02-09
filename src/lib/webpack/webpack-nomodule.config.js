const BROWSERS = ['> 1%', 'last 2 versions', 'Firefox ESR', 'not ie <= 11'];

export default () => {
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
                require.resolve('babel-preset-env'),
                {
                  targets: {browsers: BROWSERS},
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
    }
  };
};
