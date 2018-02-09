# PolymerX CLI

[![Build Status](https://travis-ci.org/PolymerX/polymerx-cli.svg?branch=master)](https://travis-ci.org/PolymerX/polymerx-cli) [![Build status](https://ci.appveyor.com/api/projects/status/wkxltr345600y1ih?svg=true)](https://ci.appveyor.com/project/LasaleFamine/polymerx-cli)
 [![codecov](https://codecov.io/gh/PolymerX/polymerx-cli/badge.svg?branch=master)](https://codecov.io/gh/PolymerX/polymerx-cli?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/PolymerX/polymerx-cli.svg?style=flat-square)](https://github.com/PolymerX/polymerx-cli/issues)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)
[![PolymerX CLI](https://img.shields.io/badge/polymerX-CLI-blue.svg?style=flat-square)](https://github.com/PolymerX/polymerx-cli)

# ⚠️ ️ THIS TOOL IS NOT READY YET. PLEASE WAIT  ⚠️

> Unlock the power of Polymer 3, Web Components and modern web tools.

## Features

* Generate a Polymer Skeleton for your next project in 30 seconds.

More to come...

## Install

> NOTE: Node.js >= 6.x required.

```bash
$ yarn add global polymerx-cli
```

Or with NPM

```bash
$ npm install -g polymerx-cli
```


## Usage

```bash
$ polymerx create <template-name> <project-name>
```

> IMPORTANT: currently supported only `polymer-skeleton` as template.

Example:
```bash
$ polymerx create polymer-skeleton my-awesome-project
```

## CLI commands

### polymerx create

```
$ polymerx create --help

  --version   Show version number                                      [boolean]
  --cwd       A directory to use instead of $PWD.                                [default: "."]
  --name      The application's name
  --author    Author of the app                                                  [default: null]
  --force     Force option to create the directory for the new app               [default: false]
  --yarn      Use 'yarn' instead of 'npm'                              [boolean] [default: false]
  --git       Initialize version control using git                     [boolean] [default: false]
  --install   Install dependencies                                     [boolean] [default: true]
```

> NOTE: the required data will be asked if not specified.

#### polymerx watch

Easy development with `hot-module-replacement` and "friendly" error layers.

```
$ polymerx watch

  --cwd         A directory to use instead of $PWD.              [string]   [default: .]
  --src         Entry file (index.js)                            [string]   [default: "src"]
  --port, -p    Port to start a server on                        [string]   [default: "8080"]
  --host,       Hostname to start a server on                    [string]   [default: "0.0.0.0"]
```

> NOTE: You can run the dev server on a different port using `PORT=8091 polymerx watch`


## About this tool

This CLI is heavily inspired by the awesome [`preact-cli`](https://github.com/developit/preact-cli) and aims to became a stable tool for developing Polymer 3 PWA easily and with modern web tools.


## License

MIT © [LasaleFamine](https://github.com/PolymerX)
