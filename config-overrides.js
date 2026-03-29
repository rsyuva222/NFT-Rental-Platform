const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto:  require.resolve("crypto-browserify"),
    stream:  require.resolve("stream-browserify"),
    http:    require.resolve("stream-http"),
    https:   require.resolve("https-browserify"),
    os:      require.resolve("os-browserify/browser"),
    url:     require.resolve("url"),
    buffer:  require.resolve("buffer"),
    process: require.resolve("process/browser"),
    zlib:    false,
    fs:      false,
    net:     false,
    tls:     false,
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer:  ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ];

  config.ignoreWarnings = [/Failed to parse source map/];

  return config;
};
