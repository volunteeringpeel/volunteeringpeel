const path = require('path');
require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

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
              presets: ['es2015', 'react'],
              plugins: ['transform-object-rest-spread', 'lodash'],
            },
          },
        ],
      },

      {
        test: /\.(sass|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: '[name]__[local]___[hash:base64:5]',
              importLoaders: 1,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
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
              name: 'dist/app/fonts/[name].[ext]',
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
              name: 'dist/app/img/[name].[ext]',
            },
          },
        ],
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, './dist/app'),
    filename: '[name].js',
  },

  plugins: [
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel',
      chunks: ['app'],
      filename: 'index.html'
    }),
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel Admin',
      chunks: ['admin'],
      filename: 'admin.html'
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx'],
  },
};
