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
  'dist/index.html',
  'dist/manifest.json',
  'dist/module.bundle.js',
  'dist/sw.js',
  'dist/vendor/custom-elements-es5-adapter.js',
  'dist/vendor/webcomponents-hi-sd-ce.js',
  'dist/vendor/webcomponents-lite.js',
  'dist/vendor/webcomponents-loader.js',
  'dist/vendor/webcomponents-sd-ce.js'
];

module.exports = isWin => isWin ? files.map(file => file.replace(/\//g, '\\')) : files;
