const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

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

  devtool: 'source-map',

  // this is a server app not a web app
  target: 'node',

  // keep node_module paths out of the bundle
  externals: [nodeExternals(), { './passwords': 'commonjs ./passwords' }],

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
              configFileName: 'tsconfig.server.json',
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],

  // just a copy from common.
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: [path.resolve(__dirname, './node_modules')],
    alias: {
      '@app': path.resolve(__dirname, 'src', 'app'),
      '@api': path.resolve(__dirname, 'src', 'api'),
      '@lib': path.resolve(__dirname, 'lib'),
    },
  },
};
