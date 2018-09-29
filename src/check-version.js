const colors = require('chalk');
const pkg = require('./../package.json');

const version = parseFloat(process.version.substr(1), 10);
const minimum = parseFloat(pkg.engines.node.match(/\d+/g).join('.'), 10);

const write = message => process.stdout.write(message) + '\n';
const exit = () => process.exit(1); // eslint-disable-line unicorn/no-process-exit

module.exports = function () {
  if (version >= minimum) {
    return true;
  }

  const errorMessage = colors.yellow(`
		⚠️  polymerx-cli requires at least node@${minimum}!
		You have node@${version}
	`);

  // Version not supported && exit
  write(errorMessage);
  exit();
};
