const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

// this was copypasted from a faq should cover just about everybody ever
const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

// grab the common config and...
module.exports = merge(common, {
  // fix things by adding a bunch of middleware
  // (stuff that makes it better, but slower so we don't include it in production)
  entry: {
    app: ['react-hot-loader/patch', 'webpack-hot-middleware/client', './app.tsx'],
    admin: ['react-hot-loader/patch', 'webpack-hot-middleware/client', './admin.tsx'],
  },

  // obviously need this for debugging
  devtool: 'source-map',

  module: {
    rules: [
      {
        // for typescript files
        test: /\.tsx?$/,
        // ignore node_modules
        exclude: [/node_modules/],
        use: [
          // use hot loader (so no need for server restart)
          { loader: 'react-hot-loader/webpack' },
          // and load normally, but with more awesome.
          {
            loader: 'awesome-typescript-loader',
            options: {
              // also use cache so it's faster
              useCache: true,
            },
          },
        ],
      },

      {
        // for fancy css (less) files
        test: /\.less$/,
        use: [
          // load directly into the javascript
          { loader: 'style-loader' },
          // make into css with sourcemap
          { loader: 'css-loader', options: { sourceMap: true } },
          // make less into css
          {
            loader: 'less-loader',
            options: {
              // cause i'm bad and debugging.
              sourceMap: true,
              // support lotsa browsers
              plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
            },
          },
        ],
      },
    ],
  },

  output: {
    // output things to /dist/app
    path: path.resolve(__dirname, 'dist', 'app'),
    // name them abcdef.js
    filename: '[name].js',
    // everything is relative to /
    publicPath: '/',
  },

  // enable hot-module thingies.
  plugins: [new webpack.HotModuleReplacementPlugin()],
});
