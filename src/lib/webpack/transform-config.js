import path from 'path';
import standardFs from 'fs';
import pify from 'pify';

import WebpackConfigHelpers from './helpers/WebpackConfigHelpers';

const fs = pify(standardFs);

export default async function (env, config) {
  const transformerPath = path.resolve(env.cwd, env.config);

  try {
    await fs.stat(transformerPath);
  } catch (_) {
    if (env.config) {
      throw new Error(`polymerx-cli config could not be loaded!\nFile ${env.config} not found.`);
    }

    return;
  }

  require('@babel/register')({
    presets: [require.resolve('@babel/preset-env')]
  });

  const m = require(transformerPath);
  const transformer = (m && m.default) || m;
  try {
    await transformer(config, {...env}, new WebpackConfigHelpers(env.cwd));
  } catch (error) {
    throw new Error(`Error at ${transformerPath}: \n` + error);
  }
}
