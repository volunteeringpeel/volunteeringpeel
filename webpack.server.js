const fs = require('fs');
const path = require('path');

// for the server...
module.exports = {
  // use ./src/index.ts as the entry point
  entry: path.resolve(__dirname, 'src', 'index.ts'),

  output: {
    // output to /dist (not /dist/app)
    path: path.resolve(__dirname, 'dist'),
    // name it
    filename: 'index.js',
  },

  // this is a server app not a web app
  target: 'node',

  // keep node_module paths out of the bundle
  externals: fs
    .readdirSync(path.resolve(__dirname, 'node_modules'))
    .concat(['react-dom/server', 'react/addons'])
    .reduce(function(ext, mod) {
      ext[mod] = 'commonjs ' + mod;
      return ext;
    }, {}),

  // set a few globals
  node: {
    __filename: false,
    __dirname: false,
  },

  module: {
    loaders: [
      {
        // our usual bunch of awesome
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
    ],
  },

  // just a copy from common.
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      '@app': path.resolve(__dirname, 'src', 'app'),
    },
  },
};
