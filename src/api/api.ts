/* tslint:disable:no-console no-var-requires */
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as mysql from 'promise-mysql';

const passwordsJson = require('./passwords');

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

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://volunteering-peel.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://volunteering-peel.auth0.com/`,
  algorithms: ['RS256'],
}).unless({ path: [/\/public*/] });

// Success/error functions
api.use((req, res, next) => {
  res.error = (status, error, details) => {
    res
      .status(status)
      .json({ error, details: details || 'No further information', status: 'error' });
  };
  res.success = (data, status = 200) => {
    if (data) res.status(status).json({ data, status: 'success' });
    else res.status(status).json({ status: 'success' });
  };

  // Store pool connection inside of req for access by other API files
  req.pool = pool;
  next();
});

api.use(checkJwt);

api.use((err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.error((err as jwt.UnauthorizedError).status, (err as jwt.UnauthorizedError).message);
  }
});

// Get current user
api.get('/user/current', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      // Try selecting a user
      return db.query('SELECT * from user WHERE email = ?', [req.user.email]);
    })
    .then(user => {
      // User does not exist, create a new user account
      if (!user[0]) {
        console.log(req.user);
        // tslint:disable-next-line:variable-name
        const [first_name, last_name] = req.user.name ? req.user.name.split(/ (.+)/) : ['', ''];
        const newUser = {
          // might be the same as email cause auth0 is weird af
          first_name,
          // the name can be email if none is provided by auth0,
          // so if last name isn't a thing, make it a blank string
          last_name: last_name || '',
          email: req.user.email,
          role_id: 1,
        };
        return db
          .query('INSERT INTO user SET ?', newUser)
          .then(_ => ({ ...newUser, newUser: true }));
      } else {
        return user[0];
      }
    })
    .then(user => {
      res.success(user, user.newUser ? 201 : 200);
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      console.log(db, error);
      if (db && db.end) db.release();
    });
});

api.post('/user/current', (req, res) => {
  // get parameters from request body
  const { first_name, last_name, phone_1, phone_2 } = req.body;
  // ensure that all parameters exist
  if (!first_name || !last_name || !phone_1 || !phone_2) {
    return res.error(400, 'Missing required field');
  }

  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      // update the profile in the database
      return db.query('UPDATE user SET ? WHERE ?', [
        // fields to update
        { first_name, last_name, phone_1, phone_2 },
        // find the user with this email
        { email: req.user.email },
      ]);
    })
    .then(_ => {
      res.success('Profile updated successfully');
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// FAQ's
api.get('/public/faq', (req, res) => {
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
      res.error(500, 'Database error', error);
    });
});

// Execs
api.get('/public/execs', (req, res) => {
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
      res.error(500, 'Database error', error);
    });
});

// Sponsors
api.get('/public/sponsors', (req, res) => {
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
      res.error(500, 'Database error', error);
    });
});

// Events
const eventQuery = (req: Express.Request, res: Express.Response, authorized: boolean) => {
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
        const query = authorized
          ? // Query if logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.date, s.start_time, s.end_time,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              (CASE WHEN us.user_id IS NULL THEN 0 ELSE 1 END) AS signed_up
            FROM vw_shift s
            JOIN user u
            LEFT JOIN user_shift us ON us.shift_id = s.shift_id AND us.user_id = u.user_id
            WHERE s.event_id = ? AND u.email = ?`
          : // Query if not logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.date, s.start_time, s.end_time,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              0 signed_up
            FROM vw_shift s
            WHERE s.event_id = ? AND ?`;
        const userID = authorized ? req.user.email : -1;
        return db.query(query, [event.event_id, userID]).then(shifts => {
          return out.push({
            ...event,
            shifts: shifts.map((shift: any) => ({
              ...shift,
              meals: shift.meals.split(','),
              // Deal with booleans
              signed_up: !!shift.signed_up,
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
      res.error(500, 'Database error', error);
    });
};

api.get('/events', (req, res) => eventQuery(req, res, true));
api.get('/public/events', (req, res) => eventQuery(req, res, false));

// Signup
api.post('/signup', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      const values = (req.body.shifts as number[]).map(shift => [req.user.email, shift]);
      return db.query('INSERT INTO user_shift (user_id, shift_id) VALUES ?', [values]);
    })
    .then(execs => {
      res.success('Signed up successfully');
      db.release();
    })
    .catch(error => {
      if (db && db.end) db.release();
      res.error(500, 'Database error', error);
    });
});

// 404
api.get('*', (req, res) => {
  res.error(404, 'Unknown endpoint');
});

export default api;
