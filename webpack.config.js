const path = require('path');
require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = {
  context: path.resolve(__dirname, './src/app'),

  entry: {
    app: './app.jsx',
    admin: './admin.jsx',
  },

  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'react'],
              plugins: ['transform-object-rest-spread', 'lodash'],
            },
          },
        ],
      },

      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1,
            },
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              plugins: [new LessPluginAutoPrefix({ browsers: autoprefixerBrowsers })],
            },
          },
        ],
      },

      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './dist/app/fonts/[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.(png|jpg|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './dist/app/img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, './dist/app'),
    filename: '[name].js',
    publicPath: '/',
  },

  plugins: [
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel',
      chunks: ['app'],
      filename: 'index.html',
      template: 'index.ejs',
    }),
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel Admin',
      chunks: ['admin'],
      filename: 'admin.html',
      template: 'index.ejs',
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
