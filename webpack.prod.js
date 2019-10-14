const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');

// this was copypasted from a faq should cover just about everybody ever
const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

// grab the common config and...
module.exports = merge(common, {
  mode: 'production',

  // devtool: 'source-map', // turn on sourcemap for debugging

  module: {
    rules: [
      {
        // for typescript files...
        test: /\.tsx?$/,
        // ignore dependencies,
        exclude: [/node_modules/],
        use: [
          { loader: 'cache-loader' },
          // note lack of hot-loader,
          {
            // parse normally,
            loader: 'awesome-typescript-loader',
            options: {
              // and use cache to make rebuilds faster
              useCache: true,
              useBabel: true,
            },
          },
        ],
      },

      {
        // for less files (fancy css)...
        test: /\.less$/,
        use: [
          // make sure to put them in a separate file,
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'cache-loader' },
          // use css. also sourcemap.
          { loader: 'css-loader' },
          {
            // parse less for css-loader
            loader: 'less-loader',
            options: {
              // source map for debugging
              // sourceMap: true,
              // support all the browsers in the list up there
              plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
            },
          },
        ],
      },

      {
        // library css files
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'cache-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },

  output: {
    // output things to /dist/app
    path: path.resolve(__dirname, 'dist', 'app'),
    // name them abcdef.version.js
    filename: '[name].[chunkhash].js',
    // everything is relative to /
    publicPath: '/',
  },

  plugins: [
    // delete old files
    new CleanWebpackPlugin({ cleanOnceBeforeBuildPatterns: ['**/*', '!upload'] }),
    // use special module ids for caching
    new webpack.HashedModuleIdsPlugin(),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // all options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    new OptimizeCssnanoPlugin(),
    new MinifyPlugin({
      mangle: false,
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // merge chunks
  ],
});
