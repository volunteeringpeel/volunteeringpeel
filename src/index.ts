/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';
import * as express from 'express';
import * as mysql from 'mysql';
import * as path from 'path';
import sessionManagement from './sessionManagement';

import 'babel-polyfill';

const passwordsJson = require('../passwords.json');

// Setup Express
const app = express();
const port = process.env.PORT || 19847;

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
app.use(express.static(path.resolve(__dirname, 'app')));

// API
app.post('/api/login', (req, res) => {
  res.send(req.session);
});

// React
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'app', 'index.html'));
});

// Listen
console.log(`Listening on port ${port}`);
app.listen(port);
