/* tslint:disable:no-console no-var-requires */
import * as Promise from 'bluebird';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';

import api from './api';
import sessionManagement from './sessionManagement';

import 'babel-polyfill';

// Setup Express
const app = express();
// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// Parse application/json
app.use(bodyParser.json());
// Sessions
sessionManagement(app);

// Use random number for port if in dev environment
const port = process.env.PORT || 19847;

// Find working directory
const appDir = process.env.NODEMON
  ? path.resolve(__dirname, '../dist', 'app')
  : path.resolve(__dirname, 'app');

// Static assets
app.use(express.static(path.resolve(appDir)));

// API
app.use('/api', api);

// React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(appDir, 'index.html'));
});

// Listen
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
