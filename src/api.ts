/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';
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

if (process.env.NODE_ENV !== 'production') {
  api.use((req, res, next) => {
    console.log(`Request: ${req.originalUrl} (${req.method})`);
    next();
  });
}

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

// Get user data
api.get('/user', (req, res) => {
  if (req.session.userData) {
    res.success(req.session.userData);
  } else {
    res.success('Not logged in');
  }
});

// Login
api.post('/user/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  // Check if already logged in
  if (req.session.userData) return res.success('Already logged in!');
  // Ensure fields are filled in
  if (!email || !password) return res.error('Blank email or password');
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
      db.release();
      res.success('Logged in');
    })
    .catch(error => {
      if (db && db.release) db.release();
      res.error('Database error', error);
    });
});

// Logout
api.all('/user/logout', (req, res) => {
  req.session.destroy(error => {
    if (error) res.error(error);
    res.success('Logged out');
  });
});

// FAQ's
api.get('/faq', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('SELECT question, answer FROM faq ORDER BY priority');
    })
    .then(faqs => {
      res.success(faqs);
      db.release();
    })
    .catch(error => {
      if (db && db.end) db.release();
      res.error('Database error', error);
    });
});

// Execs
api.get('/execs', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('SELECT first_name, last_name, bio FROM user WHERE role_id = 3');
    })
    .then(execs => {
      res.success(execs);
      db.release();
    })
    .catch(error => {
      if (db && db.end) db.release();
      res.error('Database error', error);
    });
});

// Sponsors
api.get('/sponsors', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('SELECT name, image, website FROM sponsor ORDER BY priority');
    })
    .then(execs => {
      res.success(execs);
      db.release();
    })
    .catch(error => {
      if (db && db.end) db.release();
      res.error('Database error', error);
    });
});

// Events
api.get('/events', (req, res) => {
  let db: mysql.PoolConnection;
  const out: VPEvent[] = [];
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('SELECT event_id, name, address, transport, description FROM event');
    })
    .then(events => {
      const promises = events.map((event: VPEvent) => {
        const query = req.session.userData
          ? // Query if logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.date, s.start_time, s.end_time,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              (CASE WHEN us.user_id IS NULL THEN 0 ELSE 1 END) AS signed_up
            FROM vw_shift s
            JOIN user u
            LEFT JOIN user_shift us ON us.shift_id = s.shift_id AND us.user_id = u.user_id
            WHERE s.event_id = ? AND u.user_id = ?`
          : // Query if not logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.date, s.start_time, s.end_time,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              0 signed_up
            FROM vw_shift s
            WHERE s.event_id = ? AND ?`;
        const userID = req.session.userData ? req.session.userData.user_id : -1;
        return db.query(query, [event.event_id, userID]).then(shifts => {
          console.log([event.event_id, userID]);
          return out.push({
            ...event,
            shifts: shifts.map((shift: any) => ({
              ...shift,
              meals: shift.meals.split(','),
            })),
          });
        });
      });
      return Promise.all(promises);
    })
    .then(events => {
      res.success(out);
      db.release();
    })
    .catch(error => {
      if (db && db.end) db.release();
      res.error('Database error', error);
    });
});

// Basically a 404
api.get('*', (req, res) => {
  res.error('Unknown endpoint');
});

export default api;
