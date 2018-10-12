# PolymerX CLI

[![Greenkeeper badge](https://badges.greenkeeper.io/PolymerX/polymerx-cli.svg)](https://greenkeeper.io/)

[![npm](https://img.shields.io/npm/v/polymerx-cli.svg?style=flat-square)](https://github.com/PolymerX/polymerx-cli)

[![Build Status](https://travis-ci.org/PolymerX/polymerx-cli.svg?branch=master)](https://travis-ci.org/PolymerX/polymerx-cli) [![Build status](https://ci.appveyor.com/api/projects/status/wkxltr345600y1ih?svg=true)](https://ci.appveyor.com/project/LasaleFamine/polymerx-cli)
 [![codecov](https://codecov.io/gh/PolymerX/polymerx-cli/badge.svg?branch=master)](https://codecov.io/gh/PolymerX/polymerx-cli?branch=master)
[![GitHub issues](https://img.shields.io/github/issues/PolymerX/polymerx-cli.svg?style=flat-square)](https://github.com/PolymerX/polymerx-cli/issues)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg?style=flat-square)](https://github.com/sindresorhus/xo)
[![PolymerX CLI](https://img.shields.io/badge/polymerX-CLI-blue.svg?style=flat-square)](https://github.com/PolymerX/polymerx-cli)

> Unlock the power of Polymer 3, Web Components and modern web tools.

## Features

* Generate a Polymer Skeleton for your next project in 30 seconds.
* Build using **Webpack 4** under the hood producing Service Worker with WorkboxJs.
* Develop with ease with `hot-reload` and error layer enabled.
* Support for PostCSS (with personal configuration) when getting CSS from external files.
* `https` certificate generation on the fly for development.
* **No magic, just using the tools.**

More to come...

## Install

> NOTE: Node.js >= 8.x required.

```bash
$ yarn global add polymerx-cli
```

Or with NPM

```bash
$ npm install -g polymerx-cli
```

## Templates

Official templates are available at https://github.com/Polymerx-skeleton-templates


## Usage

```bash
$ polymerx create <template-name> <project-name>
```

> IMPORTANT: currently supported only `default` as template.

Example:
```bash
$ polymerx create default my-awesome-project
```

## CLI commands

### ⚙️ polymerx create

```
$ polymerx create --help

  --version   Show version number                                      [boolean]
  --cwd       A directory to use instead of $PWD.                                [default: "."]
  --name      The application's name
  --author    Author of the app                                                  [default: null]
  --force     Force option to create the directory for the new app               [default: false]
  --yarn      Use 'yarn' instead of 'npm'                              [boolean] [default: false]
  --git       Initialize version control using git                     [boolean] [default: false]
  --https     Use HTTPS?                                               [boolean] [default: false]
  --install   Install dependencies                                     [boolean] [default: true]
```

> NOTE: the required data will be asked if not specified.

### 🕶 polymerx watch

Easy development with `hot-reload` and "friendly" error layers.

##### IMPORTANT: `postcss` configuration file must be present.

```
$ polymerx watch --help

  --cwd           A directory to use instead of $PWD.              [string]   [default: .]
  --src           Entry file (index.js)                            [string]   [default: "src"]
  --config, -c    Path to custom polymerx.config.js.           [string]   [default: null]
  --port, -p      Port to start a server on                        [string]   [default: "8080"]
  --host,         Hostname to start a server on                    [string]   [default: "0.0.0.0"]
```

> NOTE: You can run the dev server on a different port using `PORT=8091 polymerx watch`

### 📦 polymerx build

Create a production build with (or without) Service Workers.
##### IMPORTANT: `postcss` configuration file must be present.

```
$ polymerx build --help

  --cwd             A directory to use instead of $PWD.          [string]   [default: .]
  --src             Entry file (index.js).                       [string]   [default: "src"]
  --dest            Directory root for output.                   [string]   [default: "dist"]
  --config, -c      Path to custom polymerx.config.js.           [string]   [default: null]
  --workers, -w     Add a service worker to application.         [boolean]  [default: true]
  --clean           Clear output directory before building.      [boolean]  [default: true]
```

## Custom Configuration

### Webpack
For customizing your `webpack` configuration create a `polymerx.config.js` what will exports a function like this:

```js
/**
 * Function that mutates original webpack config.
 * Supports asynchronous changes when promise is returned.
 *
 * @param {object} config - original webpack config.
 * @param {object} env - options passed to CLI.
 * @param {WebpackConfigHelpers} helpers - object with useful helpers when working with config.
 **/
export default function (config, env, helpers) {
  /** you can change config here **/
}
```
Since this we are using the [WebpackConfigHelpers](https://github.com/developit/preact-cli/blob/master/docs/webpack-helpers.md) by `preact-cli` you can checkout also their [awesome Wiki](https://github.com/developit/preact-cli/wiki/Config-Recipes)
to get more info about the helper.

## About this tool

This CLI is heavily inspired by the awesome [`preact-cli`](https://github.com/developit/preact-cli) and aims to became a stable tool for developing Polymer 3 PWA easily and with modern web tools.


## License

MIT © [LasaleFamine](https://github.com/PolymerX)
