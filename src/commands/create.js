/* eslint-disable unicorn/no-process-exit */

import {resolve, dirname} from 'path';
import ora from 'ora';
import gittar from 'gittar';
import {prompt} from 'inquirer';
import validateName from 'validate-npm-package-name';
import gitUser from 'git-user-local';
import replaceOwner from '../lib/replace-owner';
import isMissing from '../lib/is-missing';
import asyncCommand from '../lib/async-command';
import which from '../lib/which';
import errorAlert from '../lib/error';
import isDir from '../lib/is-dir';
import extractTar from '../lib/extract-tar';
import install from '../lib/install';
import getPkg from '../lib/get-pkg';

const ORG = 'PolymerX-skeleton-templates';

const getAuthor = async () => {
  const {user} = await gitUser();
  return `${user ? user.name : ''} <${user ? user.email : ''}>`;
};

const capitalize = str => str.charAt(0).toUpperCase() + str.substring(1);
const completeData = async (argv, spinner) => {
  const questions = isMissing(argv);
  if (questions.length > 0) {
    spinner.warn('Missing commang arguments. Prompting...');
    spinner.info('Alternatively, run `polymerx create --help` for usage info.');
  }

  const response = await prompt(questions);
  return {...response};
};

const checkExistOrForce = async (exists, isForceEnabled, spinner) => {
  if (exists && !isForceEnabled) {
    errorAlert(
      `Refusing to overwrite current directory!
Please specify a different destination or use the \`--force\` flag`, spinner
    );
    return process.exit(1);
  }

  if (exists && isForceEnabled) {
    const {enableForce} = await prompt({
      type: 'confirm',
      name: 'enableForce',
      message: 'You are using \'--force\'. Do you wish to continue?',
      default: false
    });

    if (!enableForce) {
      errorAlert('Refusing to overwrite current directory!', spinner);
      return process.exit(1);
    }

    spinner.info('Initializing project in the current directory!');
  }
};

const getStarted = (destFolder, isYarn) => {
  const prefix = isYarn ? 'yarn' : 'npm run';
  const text = `
    To get started, cd into the new directory:
      cd ${destFolder}
    To start a the dev server with live-reload (for browsers WITHOUT ES6 module support):
      ${prefix} dev
    To create a production build (in ./dist):
      ${prefix} build
    To start a production HTTP server:
      ${prefix} start
  `;
  return console.log(text.trim().replace(/^\t+/gm, ''), '\n');
};

export default asyncCommand({
  command: 'create [template] [dest]',

  desc: 'Create a new application.',

  builder: {
    cwd: {
      description: 'A directory to use instead of $PWD.',
      default: '.'
    },
    name: {
      description: 'The application\'s name'
    },
    author: {
      description: 'Author of the app',
      default: null
    },
    force: {
      description: 'Force option to create the directory for the new app',
      type: 'boolean',
      default: false
    },
    yarn: {
      description: 'Use \'yarn\' instead of \'npm\'',
      type: 'boolean',
      default: false
    },
    git: {
      description: 'Initialize version control using git',
      type: 'boolean',
      default: false
    },
    install: {
      description: 'Install dependencies',
      type: 'boolean',
      default: true
    }
  },

  async handler(argv) {
    const spinner = ora({
      text: 'Analyzing args...',
      color: 'magenta'
    }).start();

    // Prompt if incomplete data
    const restData = await completeData(argv, spinner);
    Object.assign(argv, restData);

    const cwd = resolve(argv.cwd);
    const packageName = argv.name || argv.dest;
    const destFolder = argv.dest || dirname(cwd);
    const target = resolve(cwd, destFolder);
    const author = argv.author || await getAuthor();
    const installDeps = argv.install;

    // Check if dir exists
    const exists = isDir(target);
    const isForceEnabled = argv.force;
    // Side effects...
    await checkExistOrForce(exists, isForceEnabled, spinner);

    const repo = argv.template.includes('/') ? argv.template :
      `${ORG}/${argv.template}`;

    spinner.info(`Getting ${repo}...`);

    const {errors} = validateName(packageName);
    if (errors) {
      errors.unshift(`Invalid package name: ${packageName}`);
      errorAlert(errors.map(capitalize).join('\n  ~ '), spinner);
      return process.exit(1);
    }

    // Attempt to fetch the `template`
    const archive = await gittar.fetch(repo).catch(error => {
      const finalErr = error || {message: 'An error occured while fetching template.'};
      errorAlert(
        finalErr.code === 404 ? `Could not find repository: ${repo}` : finalErr.message, spinner
      );
      return process.exit(1);
    });

    spinner.text = '⚡️  Creating project';
    spinner.color = 'yellow';
    spinner.start();

    // Extract files from `archive` to `target`
    const keeps = await extractTar(archive, target);
    const isRepoEmpty = keeps.length <= 0;
    if (isRepoEmpty) {
      errorAlert(`No \`template\` directory found within ${repo}!`, spinner);
      return process.exit();
    }

    spinner.color = 'magenta';
    spinner.text = '⚙️  Making changes to files...';
    await replaceOwner(keeps, packageName, author);

    const pkg = await getPkg(target);
    if (!pkg) {
      spinner.warn('⚠️ Could not locate `package.json` file!');
    }

    const isYarn = argv.yarn &&
      await which('yarn')
        .catch(() => {
          errorAlert('Yarn not found. Please remove the "--yarn" flag or install yarn.', spinner);
          process.exit(1);
        });

    if (installDeps) {
      spinner.color = 'cyan';
      spinner.text = '📦  Installing dependencies...';
      await install(target, isYarn);
    }

    spinner.succeed('Everything cloned and installed correctly!\n');
    getStarted(destFolder, isYarn);
  }
});
