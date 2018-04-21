import chalk from 'chalk';
import Table from 'cli-table';
import {formatSize} from 'webpack/lib/SizeFormatHelpers';

const log = msg => process.stdout.write(msg);
const beautySize = (size, isOverSizeLimit) => isOverSizeLimit ?
  chalk.red(formatSize(size)) : chalk.green(formatSize(size));

const stripLoaderPrefix = str =>
  typeof str === 'string' ?
    str
      // eslint-disable-next-line max-len
      .replace(/(^|\b|@)(\.\/~|\.{0,2}\/[^\s]+\/node_modules)\/\w+-loader(\/[^?!]+)?(\?\?[\w_.-]+|\?({[\s\S]*?})?)?!/g, '') :
    str;

export function showStats(stats) {
  const info = stats.toJson('errors-only');

  if (stats.hasErrors()) {
    info.errors
      .map(stripLoaderPrefix)
      .forEach(msg => log(chalk.red(msg)));
  }

  if (stats.hasWarnings()) {
    info.warnings
      .map(stripLoaderPrefix)
      .forEach(msg => log(chalk.yellow(msg)));
  }

  return stats;
}

export function endMessage(statsAssets, error) {
  if (error) {
    return log(chalk.red('\n\nBuild failed!\n\n'));
  }

  const assets = statsAssets
    .sort((a, b) => b.size - a.size)
    .reduce((acc, {name, size, isOverSizeLimit}) =>
      acc.concat([[name, beautySize(size, isOverSizeLimit)]]),
    []);

  const table = new Table({
    style: {head: ['blue']},
    head: ['Asset', 'Size']
  });
  table.push(...assets);

  log('\n');
  log(chalk.green('Compiled successfully!\n\n'));
  log(table.toString() + '\n\n');
}

export function endBuildMessage(stats, type, spinner) {
  return stats.hasErrors() ?
    spinner.fail(`Build failed! [type: ${type}]`) :
    spinner.succeed(`Compiled! [type: ${type}] `);
}

export function detailMessage(err, {port, userPort, serverAddr, nomodule}) {
  if (err) {
    return;
  }

  if (port !== userPort) {
    log(`Port ${chalk.bold(userPort)} is in use, using ${chalk.bold(port)} instead\n\n`);
  }

  log(
    chalk.magentaBright(nomodule ?
      'You are running a `nomodule` dev task: Firefox, Edge etc.\n' :
      'You are running a `module` dev task: Chrome, Safari etc.\n'
    )
  );
  log('Check the application in browser.\n\n');
  log(`${chalk.bold('Local:')} ${serverAddr}\n`);
}
