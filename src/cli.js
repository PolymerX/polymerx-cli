#!/usr/bin/env node

import yargs from 'yargs';
import updateNotifier from 'update-notifier';
import create from './commands/create';
import watch from './commands/watch';
import build from './commands/build';
import logo from './lib/logo';

import checkVersion from './check-version';

const pkg = require('./../package.json');

const HELP = `
  polymerx-cli ${pkg.version}\n\nFor help with a specific command, enter:\npolymerx help [command]
`.replace(/\t/g, '');

// Check current node version
checkVersion();

updateNotifier({pkg}).notify();

/* eslint-disable no-unused-expressions */
yargs
  .command(create)
  .command(watch)
  .command(build)
  .usage(logo(HELP))
  .help()
  .alias('h', 'help')
  .demandCommand()
  .strict()
  .argv;

