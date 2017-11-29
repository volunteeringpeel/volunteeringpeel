const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // do all of these things relative to ./src/app
  context: path.resolve(__dirname, 'src', 'app'),

  // have two pages, app and admin (/ and /admin)
  entry: {
    app: './app.tsx',
    admin: './admin.tsx',
    vendor: [
      'auth0-js',
      'auth0-lock-passwordless',
      'axios',
      'babel-polyfill',
      'bluebird',
      'immutability-helper',
      'lodash-es',
      'moment',
      'react',
      'react-markdown',
      'react-redux',
      'react-router',
      'react-router-config',
      'react-router-dom',
      'react-router-redux',
      'redux',
      'redux-actions',
      'redux-thunk',
      'reselect',
      'semantic-ui-react',
    ],
  },

  module: {
    // only static files are in here, everything else goes through either dev or prod
    rules: [
      {
        // fonts into the font folder,
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './fonts/[name].[ext]',
            },
          },
        ],
      },

      {
        // images into the image folder
        test: /\.(png|jpg|jpeg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  output: {
    // output things to /dist/app
    path: path.resolve(__dirname, 'dist', 'app'),
    // name them app.version.js or admin.version.js
    filename: '[name].[chunkhash].js',
    // everything is relative to /
    publicPath: '/',
  },

  plugins: [
    // delete old files
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist', 'app')]),
    // use special module ids for caching
    new webpack.HashedModuleIdsPlugin(),
    // extract huge libraries out of main file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
    }),
    // extract webpack bootstrap out of main file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
    }),
    // name the sites
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel',
      chunks: ['runtime', 'vendor', 'app'],
      filename: 'index.html',
      template: 'index.ejs',
    }),
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel Admin',
      chunks: ['runtime', 'vendor', 'admin'],
      filename: 'admin.html',
      template: 'index.ejs',
    }),
    // delete some excess shit (see https://github.com/moment/moment/issues/2517)
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],

  resolve: {
    // if no file extension use these
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    // if no absolute path use these
    modules: [path.resolve(__dirname, './node_modules')],
    // if we're really lazy just write @app to refer to ./src/app
    alias: {
      '@app': path.resolve(__dirname, 'src', 'app'),
    },
  },
};
