const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');

const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = merge(common, {
  devtool: 'source-map',

  module: {
    rules: [
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

  devServer: {
    contentBase: './dist/app',
    historyApiFallback: true,
    hot: true,
    progress: true,

    port: 19848,
    proxy: {
      '^/api/*': {
        target: 'http://localhost:19847/api/',
        secure: false,
      },
    },
  },

  plugins: [new webpack.HotModuleReplacementPlugin()],
});
