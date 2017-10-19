const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const autoprefixerBrowsers = ['last 2 versions', '> 1%', 'opera 12.1', 'bb 10', 'android 4'];

module.exports = {
  context: path.resolve(__dirname, './src/app'),

  entry: {
    app: './app.tsx',
    admin: './admin.tsx',
  },

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
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    new ExtractTextPlugin('style.css'),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
};
