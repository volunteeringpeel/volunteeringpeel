const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const Jarvis = require('webpack-jarvis');

module.exports = {
  // do all of these things relative to ./src/app
  context: path.resolve(__dirname, 'src', 'app'),

  // have two pages, app and admin (/ and /admin)
  entry: {
    app: './public/index.tsx',
    admin: './admin/index.tsx',
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
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './img/[name].[ext]',
            },
          },
        ],
      },

      {
        // files into the downloads folder
        test: /\.(docx)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './files/[name].[ext]',
            },
          },
        ],
      },

      {
        // sitemap, robots, copy normally
        test: /sitemap\.xml|robots\.txt/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './[name].[ext]',
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
      filename: 'index.html',
      template: 'index.ejs',
    }),
    new HTMLWebpackPlugin({
      title: 'Volunteering Peel Admin',
      chunks: ['runtime', 'commons', 'admin'],
      filename: 'admin.html',
      template: 'index.ejs',
    }),
    new CopyWebpackPlugin(['root']),
    // delete some excess shit (see https://github.com/moment/moment/issues/2517)
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en/),
    // fancy dashboard at http://localhost:1337
    new Jarvis(),
  ],

  resolve: {
    // if no file extension use these
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    // if no absolute path use these
    modules: [path.resolve(__dirname, './node_modules')],
    // if we're really lazy just write @app to refer to ./src/app
    alias: {
      '@app': path.resolve(__dirname, 'src', 'app'),
    },
  },
};
