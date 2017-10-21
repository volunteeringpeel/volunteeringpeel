const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  context: path.resolve(__dirname, 'src', 'app'),

  entry: {
    app: './app.tsx',
    admin: './admin.tsx',
  },

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
    path: path.resolve(__dirname, 'dist', 'app'),
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
      // template: 'index.ejs',
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, './node_modules'), path.resolve(__dirname, './src')],
  },
};
