const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = merge(common, {
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {
              useCache: true,
            },
          },
        ],
      },

      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { sourceMap: true } },
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
                plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
              },
            },
          ],
        }),
      },
    ],
  },

  plugins: [
    new ExtractTextPlugin('style.css'),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
});
