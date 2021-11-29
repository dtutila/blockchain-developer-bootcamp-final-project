const razzleHeroku = require('razzle-heroku');
module.exports = {
  modify: (config, {target, dev}, webpack) => {
    config = razzleHeroku(config, {target, dev}, webpack)
    // do something to config
    return config
  },
  options: {
    buildType: 'spa',
    enableBabelCache: false,
  },
  modifyWebpackConfig(opts) {
    const config = opts.webpackConfig;

    // Ignore fs dependencies so we can use winston
    // if (opts.env.target === 'node' && !opts.env.dev) {
    config.node = { fs: 'empty' };
    // }

    return config;
  },
};
