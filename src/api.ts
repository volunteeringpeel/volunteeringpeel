/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Express from 'express';
import * as session from 'express-session';
import * as mysql from 'mysql';

const passwordsJson = require('./passwords.json');

// Initialize API
const api = Express.Router();

// Setup MySQL
const db = mysql.createConnection({
  database: 'volunteeringpeel',
  host: 'localhost',
  user: 'volunteeringpeel',
  password: passwordsJson.mysql.password,
  charset: 'utf8mb4',
});

// Success/error functions
api.use((req, res, next) => {
  res.error = (error, details) => {
    res.status(500).json({ error, details: details || 'No further information', status: 'error' });
  };
  res.success = data => {
    if (data) res.status(200).json({ data, status: 'success' });
    else res.status(200).json({ status: 'success' });
  };
  next();
});

api.get('/user', (req, res) => {
  if (req.session.userData) {
    res.success(req.session.userData);
  } else {
    res.error('Not logged in');
  }
});

api.get('/user/login', (req, res) => {
  const { email, password } = req.body;
  db.query(
    `SELECT password FROM user WHERE email = ${db.escape(email)} LIMIT 1`,
    (error, results) => {
      if (error) res.error(error.message, error);
      bcrypt.compare(password, results[0].password).then(res.success, res.error);
    },
  );
});

// api.post('/user/login', (req, res) => {});

api.get('*', (req, res) => {
  res.error('Unknown endpoint');
});

export default api;
