const path = require('path');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // do all of these things relative to ./src/app
  context: path.resolve(__dirname, 'src', 'app'),

  // have two pages, app and admin (/ and /admin)
  entry: {
    app: './app.tsx',
    admin: './admin.tsx',
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

  plugins: [
    // extract huge libraries out of main file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: function(module) {
        // This prevents stylesheet resources with the .css or .scss extension
        // from being moved from their original chunk to the vendor chunk
        if (module.resource && /^.*\.(css|less)$/.test(module.resource)) {
          return false;
        }
        return module.context && module.context.includes('node_modules');
      },
    }),
    // extract webpack bootstrap out of main file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      minChunks: Infinity,
    }),
    // name the sites
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel',
      chunks: ['runtime', 'commons', 'app'],
      filename: './index.html',
      template: 'index.ejs',
    }),
    // new HTMLWebpackPlugin({
    //   title: 'Volunteering Peel Admin',
    //   chunks: ['runtime', 'vendor', 'admin'],
    //   filename: 'admin.html',
    //   template: 'index.ejs',
    // }),
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
