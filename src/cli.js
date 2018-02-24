#!/usr/bin/env node

import yargs from 'yargs';
import create from './commands/create';
import watch from './commands/watch';
import build from './commands/build';
import logo from './lib/logo';

const pkg = require('./../package.json');

const HELP = `
  polymerx-cli ${pkg.version}\n\nFor help with a specific command, enter:\npolymerx help [command]
`.replace(/\t/g, '');

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

