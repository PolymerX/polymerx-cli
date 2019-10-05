/* eslint-disable unicorn/filename-case */

/**
 *  From preact-cli https://github.com/developit/preact-cli/blob/master/src/lib/webpack/transform-config.js
 */

import fs from 'fs';
import path from 'path';
import webpack from 'webpack';

/**
 * WebpackConfigHelpers
 *
 * @class WebpackConfigHelpers
 */
export default class WebpackConfigHelpers {
  constructor(cwd) {
    this._cwd = cwd;
  }

  /**
   * Webpack module used to create config.
   *
   * @readonly
   * @returns {object}
   * @memberof WebpackConfigHelpers
   */
  get webpack() {
    return webpack;
  }

  /**
   * Returns wrapper around all loaders from config.
   *
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns {LoaderWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getLoaders(config) {
    return this.getRules(config).map(({
      rule,
      index
    }) => ({
      rule,
      ruleIndex: index,
      loaders: (rule.loaders || rule.use || rule.loader)
    }));
  }

  /**
   * Returns wrapper around all rules from config.
   *
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns {RuleWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getRules(config) {
    return [...(config.module.loaders || []), ...(config.module.rules || [])]
      .map((rule, index) => ({
        index,
        rule
      }));
  }

  /**
   * Returns wrapper around all plugins from config.
   *
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @returns {PluginWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getPlugins(config) {
    return (config.plugins || []).map((plugin, index) => ({
      index,
      plugin
    }));
  }

  /**
   *
   *
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param {string} file - path to test against loader. Resolved relatively to $PWD.
   * @returns {RuleWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getRulesByMatchingFile(config, file) {
    const filePath = path.resolve(this._cwd, file);
    return this.getRules(config)
      .filter(w => w.rule.test && w.rule.test.exec(filePath));
  }

  /**
   * Returns loaders that match provided name.
   *
   * @example
   * helpers.getLoadersByName(config, 'less-loader')
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param {string} name - name of loader.
   * @returns {LoaderWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getLoadersByName(config, name) {
    return this.getLoaders(config)
      .map(({
        rule,
        ruleIndex,
        loaders
      }) => Array.isArray(loaders) ?
        loaders.map((loader, loaderIndex) => ({
          rule,
          ruleIndex,
          loader,
          loaderIndex
        })) :
        [{
          rule,
          ruleIndex,
          loader: loaders,
          loaderIndex: -1
        }]
      )
      .reduce((arr, loaders) => arr.concat(loaders), [])
      .filter(({
        loader
      }) => loader === name || (loader && loader.loader === name));
  }

  /**
   * Returns plugins that match provided name.
   *
   * @example
   * helpers.getPluginsByName(config, 'HtmlWebpackPlugin')
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param {string} name - name of loader.
   * @returns {PluginWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getPluginsByName(config, name) {
    return this.getPlugins(config)
      .filter(w => w.plugin && w.plugin.constructor && w.plugin.constructor.name === name);
  }

  /**
   * Returns plugins that match provided type.
   *
   * @example
   * helpers.getPluginsByType(config, webpack.optimize.CommonsChunkPlugin)
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param {any} type - type of plugin.
   * @returns {PluginWrapper[]}
   *
   * @memberof WebpackConfigHelpers
   */
  getPluginsByType(config, type) {
    return this.getPlugins(config)
      .filter(w => w.plugin instanceof type);
  }

  /**
   * Sets template used by HtmlWebpackPlugin.
   *
   * @param {object} config - [webpack config](https://webpack.js.org/configuration/#options).
   * @param {string} template - template path. See [HtmlWebpackPlugin docs](https://github.com/jantimon/html-webpack-plugin/blob/master/docs/template-option.md).
   *
   * @memberof WebpackConfigHelpers
   */
  setHtmlTemplate(config, template) {
    let isPath;
    try {
      fs.statSync(template);
      isPath = true;
    } catch (_) {}

    const templatePath = isPath ? `!!ejs-loader!${path.resolve(this._cwd, template)}` : template;
    const {
      plugin: htmlWebpackPlugin
    } = this.getPluginsByName(config, 'HtmlWebpackPlugin')[0];
    htmlWebpackPlugin.options.template = templatePath;
  }
}
