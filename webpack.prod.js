const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

// this was copypasted from a faq should cover just about everybody ever
const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

// grab the common config and...
module.exports = merge(common, {
  devtool: 'source-map', // turn on sourcemap for debugging

  module: {
    rules: [
      {
        // for typescript files...
        test: /\.tsx?$/,
        // ignore dependencies,
        exclude: [/node_modules/],
        use: [
          // note lack of hot-loader,
          {
            // parse normally,
            loader: 'awesome-typescript-loader',
            options: {
              // and use cache to make rebuilds faster
              useCache: true,
            },
          },
        ],
      },

      {
        // for less files (fancy css)...
        test: /\.less$/,
        // make sure to put them in a separate file,
        use: ExtractTextPlugin.extract({
          // if something goes wrong don't put in separate file,
          fallback: 'style-loader',
          use: [
            // use css. also sourcemap.
            { loader: 'css-loader', options: { sourceMap: true } },
            {
              // parse less for css-loader
              loader: 'less-loader',
              options: {
                // source map for debugging
                sourceMap: true,
                // support all the browsers in the list up there
                plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('style.css'), // make sure css is separate from js
    new webpack.DefinePlugin({
      'process.env': {
        // set environment
        NODE_ENV: JSON.stringify('production'), // make sure that we think we're in prod
      },
    }),
    new UglifyJSPlugin({
      // minify everything
      sourceMap: true, // but keep the sourcemap for debugging
    }),
    new webpack.optimize.AggressiveMergingPlugin(), // merge chunks
  ],
});
