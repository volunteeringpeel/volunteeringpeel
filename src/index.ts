/* tslint:disable:no-console no-var-requires */
import * as Promise from 'bluebird';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as expressWs from 'express-ws';
import * as path from 'path';
import * as WebSocket from 'ws';

import 'babel-polyfill';

// Setup Express
const app = express();
// Enable WebSockets
export const wss = expressWs(app);

// If dev do webpack things
let compiler: any = null;
if (process.env.NODE_ENV !== 'production') {
  if (!process.env.NO_REACT) {
    // Use require so that it doesn't get imported unless necessary
    const webpack = require('webpack');
    const webpackHot = require('webpack-hot-middleware');
    const webpackDev = require('webpack-dev-middleware');
    const webpackConfig = require('../webpack.dev.js');
    compiler = webpack(webpackConfig);

    app.use(webpackHot(compiler, { publicPath: webpackConfig.output.publicPath }));
    app.use(
      webpackDev(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: {
          colors: true,
        },
      }),
    );
  }
}

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// Parse application/json
app.use(bodyParser.json());

// Use random number for port if in dev environment
const port = process.env.PORT || 19847;

// Find working directory
const appDir = (global.appDir =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, 'app')
    : path.resolve(__dirname, '../dist', 'app'));

// Static assets
app.use(express.static(path.resolve(appDir)));

// API
app.use('/api', require('@api/api').default);

// Admin page
// Really hacky use of .use instead of .get here. Should probably be changed
app.use('/admin', (req, res, next) => {
  if (compiler) {
    const filename = path.join(compiler.outputPath, 'admin.html');
    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  } else {
    res.sendFile(path.resolve(appDir, 'admin.html'));
  }
});

// Public page
app.get('*', (req, res, next) => {
  if (req.headers.upgrade === 'websocket') res.end();
  if (compiler) {
    const filename = path.join(compiler.outputPath, 'index.html');
    compiler.outputFileSystem.readFile(filename, (err: any, result: any) => {
      if (err) {
        return next(err);
      }
      res.set('content-type', 'text/html');
      res.send(result);
      res.end();
    });
  } else {
    res.sendFile(path.resolve(appDir, 'index.html'));
  }
});

// Listen
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
