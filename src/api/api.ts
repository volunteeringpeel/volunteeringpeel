/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// Import sub-APIs
import * as UserAPI from '@api/user';

const passwordsJson = require('./passwords');

// Roles
export const ROLE_VOLUNTEER = 1;
export const ROLE_ORGANIZER = 2;
export const ROLE_EXECUTIVE = 3;

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
  res.error = (status, error, details, db?) => {
    res
      .status(status)
      .json({ error, details: details || 'No further information', status: 'error' });
    if (db) db.release();
  };
  res.success = (data, status = 200, db?) => {
    if (data) res.status(status).json({ data, status: 'success' });
    else res.status(status).json({ status: 'success' });
    if (db) db.release();
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

// Get all users
api.get('/user', UserAPI.getAllUsers);

api.post('/user/:id', UserAPI.updateUser);

api.delete('/user/:id', UserAPI.deleteUser);

// Get current user
api.get('/user/current', UserAPI.getCurrentUser);

// Get user shifts (but formatted)
api.get('/attendance', (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      // grab user's first and last name as well as vw_user_shift
      return db.query(`
        SELECT us.*, u.first_name, u.last_name
        FROM vw_user_shift us
        JOIN user u ON u.user_id = us.user_id
      `);
    })
    .then((userShifts: any[]) => {
      res.success(
        _.map(userShifts, userShift => ({
          user_shift_id: +userShift.user_shift_id,
          confirmLevel: {
            id: +userShift.confirm_level_id,
            name: userShift.confirm_level,
            description: userShift.confirm_description,
          },
          hours: userShift.hours,
          shift: {
            shift_id: +userShift.shift_id,
            shift_num: +userShift.shift_num,
            start_time: userShift.start_time,
            end_time: userShift.end_time,
          },
          parentEvent: {
            event_id: +userShift.event_id,
            name: userShift.name,
          },
          user: {
            user_id: +userShift.user_id,
            first_name: userShift.first_name,
            last_name: userShift.last_name,
          },
        })),
      );
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// Mailing list
api.get('/mailing-list', (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query(`SELECT display_name, first_name, last_name, email FROM vw_user_mail_list`);
    })
    .then((results: any[]) => {
      // group results by display_name
      const grouped = _.groupBy(results, 'display_name');
      // for each mailing list
      const lists = _.mapValues(grouped, list =>
        // join together each user
        _.join(
          // for each user:
          _.map(list, item =>
            // join by spaces ([John, Doe, johndoe@example.com] => John Doe <johndoe@example.com>)
            _.join(
              // remove null values (i.e. if name isn't set)
              _.remove([item.first_name, item.last_name, `<${item.email}>`]),
              ' ',
            ),
          ),
        ),
      );
      res.success(lists);
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

api.post('/public/mailing-list/:id', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query(
        'INSERT INTO user (email) VALUES (?) ON DUPLICATE KEY UPDATE user_id = LAST_INSERT_ID(user_id)',
        req.body.email,
      );
    })
    .then(result =>
      db.query('INSERT INTO user_mail_list SET ?', {
        user_id: result.insertId,
        mail_list_id: req.params.id,
      }),
    )
    .then(result => {
      if (result.affectedRows === 1) {
        res.success(`${req.body.email} added to mailing list!`);
      } else {
        res.error(500, 'This should not happen.');
      }
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
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// Execs
api.get('/public/execs', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query(
        'SELECT user_id, first_name, last_name, title, bio FROM user WHERE role_id = 3',
      );
    })
    .then(execs => {
      res.success(execs);
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
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
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
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
      // Grab all events
      return db.query('SELECT event_id, name, address, transport, description, active FROM event');
    })
    .then(events => {
      // Create a promise for each event
      const promises = events.map((event: VPEvent) => {
        // If logged in, also check if user is already signed up
        const query = authorized
          ? // Query if logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.start_time, s.end_time, s.hours,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              (CASE WHEN us.user_id IS NULL THEN 0 ELSE 1 END) AS signed_up
            FROM vw_shift s
            JOIN user u
            LEFT JOIN user_shift us ON us.shift_id = s.shift_id AND us.user_id = u.user_id
            WHERE s.event_id = ? AND u.email = ?`
          : // Query if not logged in
            `SELECT
              s.shift_id, s.shift_num,
              s.start_time, s.end_time, s.hours,
              s.meals, s.max_spots, s.spots_taken, s.notes,
              0 signed_up
            FROM vw_shift s
            WHERE s.event_id = ? AND ?`;
        const userID = authorized ? req.user.email : -1; // Use -1 if logged out, as -1 will not match any users
        return db.query(query, [event.event_id, userID]).then(shifts => {
          return out.push({
            ...event,
            active: !!event.active, // Convert to boolean
            shifts: shifts.map((shift: any) => ({
              ...shift,
              meals: shift.meals.split(','),
              signed_up: !!shift.signed_up, // Convert to boolean
            })),
          });
        });
      });
      // Await all promises to return
      return Promise.all(promises);
    })
    .then(events => {
      res.success(out);
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
};

// Endpoint requires JWT (i.e. logged in)
api.get('/events', (req, res) => eventQuery(req, res, true));
// Endpoint doesn't require JWT (i.e. not logged in)
api.get('/public/events', (req, res) => eventQuery(req, res, false));

// Edit event
api.post('/events/:id', (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
  let db: mysql.PoolConnection;
  const { name, description, transport, address, active, shifts, deleteShifts } = req.body;
  let connection: Bluebird<any> = pool.getConnection();
  // Cast parameter to number, because numbers are a good
  if (+req.params.id === -1) {
    // Add new event
    connection = connection.then(conn => {
      db = conn;
      return db.query('INSERT INTO event SET ?', {
        name,
        description,
        transport,
        address,
        active,
      });
    });
  } else {
    // Change event
    connection = connection
      .then(conn => {
        db = conn;
        return db.query('UPDATE event SET ? WHERE event_id = ?', [
          { name, description, transport, address, active },
          req.params.id,
        ]);
      })
      .then(() => {
        // promise for each shift marked for deletion
        return Promise.all(
          (deleteShifts as number[]).map(id =>
            db.query('DELETE FROM shift WHERE shift_id = ?', id),
          ),
        );
      });
  }
  connection
    .then(queryResults => {
      // promise for each shift query
      return Promise.all(
        (shifts as Shift[]).map(shift => {
          const values = {
            event_id: queryResults.insertId || req.params.id,
            shift_num: shift.shift_num,
            max_spots: shift.max_spots,
            start_time: shift.start_time,
            end_time: shift.end_time,
            meals: shift.meals.join(),
            notes: shift.notes,
          };
          if (shift.shift_id === -1) {
            // Add new shift
            return db.query('INSERT INTO shift SET ?', values);
          }
          // Update shift
          return db.query('UPDATE shift SET ? WHERE shift_id = ?', [values, shift.shift_id]);
        }),
      );
    })
    .then(() => {
      res.success(`Event ${+req.params.id === -1 ? 'added' : 'updated'} successfully`);
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// Delete event
api.delete('/events/:id', (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('DELETE FROM event WHERE event_id = ?', [req.params.id]);
    })
    .then(() => {
      res.success('Event deleted successfully');
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// Signup
api.post('/signup', (req, res) => {
  let db: mysql.PoolConnection;
  pool
    .getConnection()
    .then(conn => {
      db = conn;
      return db.query('SELECT user_id FROM user WHERE email = ?', [req.user.email]);
    })
    .then(user => {
      const values = (req.body.shifts as number[]).map(shift => [user[0].user_id, shift]);
      return db.query('INSERT INTO user_shift (user_id, shift_id) VALUES ?', [values]);
    })
    .then(() => {
      res.success('Signed up successfully');
      db.release();
    })
    .catch(error => {
      res.error(500, 'Database error', error);
      if (db && db.end) db.release();
    });
});

// 404
api.get('*', (req, res) => {
  res.error(404, 'Unknown endpoint');
});

export default api;
