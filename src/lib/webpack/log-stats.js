import chalk from 'chalk';

const log = msg => process.stdout.write(msg);

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

export function endMessage(stats) {
  return stats.hasErrors() ?
    log(chalk.red('\n\nBuild failed!\n\n')) :
    log(chalk.green('\n\nCompiled successfully!\n\n'));
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
