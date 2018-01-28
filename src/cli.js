#!/usr/bin/env node

import yargs from 'yargs';
import create from './commands/create';
import logo from './lib/logo';

const pkg = require('./../package.json');

const HELP = `
  polymerx-cli ${pkg.version}\n\nFor help with a specific command, enter:\npolymerx help [command]
`.replace(/\t/g, '');

/* eslint-disable no-unused-expressions */
yargs
  .command(create)
  .usage(logo(HELP))
  .help()
  .alias('h', 'help')
  .demandCommand()
  .strict()
  .argv;

