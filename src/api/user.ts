/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';
import * as Express from 'express';
import { PoolConnection } from 'promise-mysql';

const passwordsJson = require('../passwords.json');

// Initialize API
const user = Express.Router();
// Get user data
user.get('/', (req, res) => {
  if (req.session.userData) {
    res.success(req.session.userData);
  } else {
    res.success('Not logged in');
  }
});

// Login
user.post('/login', (req, res) => {
  const { email, password } = req.body;
  // Check if already logged in
  if (req.session.userData) return res.success('Already logged in!');
  // Ensure fields are filled in
  if (!email || !password) return res.error(400, 'Blank email or password');
  let db: PoolConnection;
  req.pool
    .getConnection()
    // Get user by email
    .then(conn => {
      db = conn;
      return db.query(`SELECT password FROM user WHERE email = ? LIMIT 1`, [email]);
    })
    // Check password
    .then(users => {
      if (users.length !== 1) res.error(401, 'Unknown email');
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
        res.error(401, 'Wrong password! Please try again');
      }
    })
    .then(users => {
      req.session.userData = users[0];
      db.release();
      res.success('Logged in');
    })
    .catch(error => {
      if (db && db.release) db.release();
      res.error(500, 'Database error', error);
    });
});

// Logout
user.all('/user/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) res.error(500, error);
    res.success('Logged out');
  });
});

export default user;
