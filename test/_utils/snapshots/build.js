/* eslint-disable max-len */

const files = [
  'dist/assets/AnimatedSkeleton.svg',
  'dist/assets/icons/apple-touch-icon.png',
  'dist/assets/icons/browserconfig.xml',
  'dist/assets/icons/favicon-32x32.png',
  'dist/assets/icons/mstile-150x150.png',
  'dist/assets/icons/polymer-skeleton-192x192.png',
  'dist/assets/icons/polymer-skeleton-384x384.png',
  'dist/assets/icons/polymer-skeleton-48x48.png',
  'dist/assets/icons/polymer-skeleton-96x96.png',
  'dist/assets/icons/safari-pinned-tab.svg',
  'dist/assets/logo.svg',
  'dist/bundle.js',
  'dist/bundle.js.map',
  'dist/index.html',
  'dist/manifest.json',
  'dist/sw.js',
  'dist/vendor/bundles/webcomponents-ce.js',
  'dist/vendor/bundles/webcomponents-sd-ce-pf.js',
  'dist/vendor/bundles/webcomponents-sd-ce.js',
  'dist/vendor/bundles/webcomponents-sd.js',
  'dist/vendor/webcomponents-bundle.js',
  'dist/vendor/webcomponents-loader.js'
];

module.exports = {
  snapBuild: isWin => isWin ? files.map(file => file.replace(/\//g, '\\')) : files,
  customWebpack: '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>Webpack App</title></head><body><h1>Custom Template</h1><script defer="defer" src="bundle.js"></script><script defer="defer" src="./vendor/webcomponents-loader.js"></script></body></html>'
};
