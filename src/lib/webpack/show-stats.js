import chalk from 'chalk';

const stripLoaderPrefix = str =>
  typeof str === 'string' ?
    str
      // eslint-disable-next-line max-len
      .replace(/(^|\b|@)(\.\/~|\.{0,2}\/[^\s]+\/node_modules)\/\w+-loader(\/[^?!]+)?(\?\?[\w_.-]+|\?({[\s\S]*?})?)?!/g, '') :
    str;

export default stats => {
  const info = stats.toJson('errors-only');

  if (stats.hasErrors()) {
    info.errors
      .map(stripLoaderPrefix)
      .forEach(msg => chalk.red(msg));
  }

  if (stats.hasWarnings()) {
    info.warnings
      .map(stripLoaderPrefix)
      .forEach(msg => chalk.yellow(msg));
  }

  return stats;
};
