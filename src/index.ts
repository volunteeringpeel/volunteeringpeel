/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as mysql from 'mysql';
import * as path from 'path';

import api from './api';
import sessionManagement from './sessionManagement';

import 'babel-polyfill';

const passwordsJson = require('../passwords.json');

// Setup Express
const app = express();
const port = process.env.PORT || 19847;

// Find working directory
const appDir = process.env.NODEMON
  ? path.resolve(__dirname, '../dist', 'app')
  : path.resolve(__dirname, 'app');

// Setup MySQL
const db = mysql.createConnection({
  database: 'volunteeringpeel',
  host: 'localhost',
  user: 'volunteeringpeel',
  password: passwordsJson.mysql.password,
  charset: 'utf8mb4',
});

sessionManagement(app);

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
