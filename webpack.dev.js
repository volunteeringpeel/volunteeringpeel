const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = merge(common, {
  entry: {
    app: ['./app.tsx', 'webpack-hot-middleware/client'],
    admin: ['./admin.tsx', 'webpack-hot-middleware/client'],
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        use: [
          { loader: 'react-hot-loader/webpack' },
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
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: { sourceMap: true } },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
            },
          },
        ],
      },
    ],
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
});
