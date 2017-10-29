/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Express from 'express';
import * as session from 'express-session';
import * as mysql from 'promise-mysql';

const passwordsJson = require('./passwords.json');

// Initialize API
const api = Express.Router();

// Setup MySQL
const pool = mysql.createPool({
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

api.post('/user/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) return res.error('Blank email or password');
  if (req.session.userData) return res.success('Already logged in!');
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    // Get user by email
    .then(conn => {
      db = conn;
      return db.query(`SELECT password FROM user WHERE email = ? LIMIT 1`, [email]);
    })
    // Check password
    .then(users => {
      if (users.length !== 1) res.error('Unknown email');
      return bcrypt.compare(password, users[0].password);
    })
    // Get user data
    .then(passwordValid => {
      if (passwordValid) {
        return db.query(
          `SELECT user_id, first_name, last_name, role_id FROM user WHERE email = ?`,
          [email],
        );
      } else {
        res.error('Wrong password! Please try again');
      }
    })
    .then(users => {
      req.session.userData = users[0];
      res.success('Logged in');
    })
    .catch(error => {
      if (db && db.end) db.end();
      res.error('Database error', error);
    });
});

api.all('/user/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) res.error(error);
    res.success('Logged out');
  });
});

api.get('*', (req, res) => {
  res.error('Unknown endpoint');
});

export default api;
