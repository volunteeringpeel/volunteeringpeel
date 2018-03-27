/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// Import sub-APIs
import * as MailingListAPI from '@api/mailing-list';
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
api.use(async (req, res, next) => {
  // Store db connection inside of req for access by other API files
  let err;
  [err, req.db] = await to(pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err, req.db);

  // Return functions
  res.error = (status, error, details) => {
    res
      .status(status)
      .json({ error, details: details || 'No further information', status: 'error' });
    if (req.db) req.db.release();
  };
  res.success = (data, status = 200) => {
    if (data) res.status(status).json({ data, status: 'success' });
    else res.status(status).json({ status: 'success' });
    if (req.db) req.db.release();
  };

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
// Create or update user
api.post('/user/:id', UserAPI.updateUser);
// Delete user
api.delete('/user/:id', UserAPI.deleteUser);
// Get current user
api.get('/user/current', UserAPI.getCurrentUser);

// Get user shifts (but formatted)
api.get('/attendance', async (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // grab user's first and last name as well as vw_user_shift
  let err, userShifts: any[]; // update typings at a later date
  [err, userShifts] = await to(
    req.db.query(`
        SELECT us.*, u.first_name, u.last_name
        FROM vw_user_shift us
        JOIN user u ON u.user_id = us.user_id
      `),
  );
  if (err) return res.error(500, 'Error retreiving attendance', err);

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
});

// Get all mailing lists
api.get('/mailing-list', MailingListAPI.getMailingList);
// Create or update mailing list
api.post('/mailing-list/:id', MailingListAPI.updateMailingList);
// Delete mailing list
api.delete('/mailing-list/:id', MailingListAPI.deleteMailingList);
// Signup to mailing list id
api.post('/public/mailing-list/:id', MailingListAPI.signup);

// FAQ's
api.get('/public/faq', async (req, res) => {
  let err, faqs;
  [err, faqs] = await to(req.db.query('SELECT question, answer FROM faq ORDER BY priority'));
  if (err) return res.error(500, 'Error retrieving FAQs', err);
  res.success(faqs, 200);
});

// Execs
api.get('/public/execs', async (req, res) => {
  let err, execs;
  [err, execs] = await to(
    req.db.query('SELECT user_id, first_name, last_name, title, bio FROM user WHERE role_id = 3'),
  );
  if (err) return res.error(500, 'Error retrieving executive data', err);
  res.success(execs, 200);
});

// Sponsors
api.get('/public/sponsors', async (req, res) => {
  let err, sponsors;
  [err, sponsors] = await to(
    req.db.query('SELECT name, image, website FROM sponsor ORDER BY priority'),
  );
  if (err) return res.error(500, 'Error retrieving sponsor data', err);
  res.success(sponsors, 200);
});

// Events
const eventQuery = async (req: Express.Request, res: Express.Response, authorized: boolean) => {
  // Grab all events
  let err, events;
  [err, events] = await to(
    req.db.query('SELECT event_id, name, address, transport, description, active FROM event'),
  );
  if (err) return res.error(500, 'Error retrieving event data', err);

  // Get shifts for each event
  const withShifts = await Promise.all(
    _.map(events, async (event: VPEvent) => {
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

      let shifts;
      [err, shifts] = await to(req.db.query(query, [event.event_id, userID]));
      if (err) return res.error(500, 'Error retrieving shift data', err);

      return {
        ...event,
        active: !!event.active, // Convert to boolean
        shifts: shifts.map((shift: any) => ({
          ...shift,
          meals: shift.meals.split(','),
          signed_up: !!shift.signed_up, // Convert to boolean
        })),
      };
    }),
  );

  res.success(withShifts, 200);
};

// Endpoint requires JWT (i.e. logged in)
api.get('/events', (req, res) => eventQuery(req, res, true));
// Endpoint doesn't require JWT (i.e. not logged in)
api.get('/public/events', (req, res) => eventQuery(req, res, false));

// Edit event
api.post('/events/:id', async (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  const { name, description, transport, address, active, shifts, deleteShifts } = req.body;
  let err,
    eventID = +req.params.id;

  // Cast parameter to number, because numbers are a good
  if (eventID === -1) {
    // Add new event
    [err, { insertId: eventID }] = await to(
      req.db.query('INSERT INTO event SET ?', {
        name,
        description,
        transport,
        address,
        active,
      }),
    );
    if (err) return res.error(500, 'Error creating new event', err);
  } else {
    // Update event
    [err] = await to(
      req.db.query('UPDATE event SET ? WHERE event_id = ?', [
        { name, description, transport, address, active },
        req.params.id,
      ]),
    );
    if (err) return res.error(500, 'Error updating event data', err);

    // Delete each shift marked for deletion
    _.forEach(deleteShifts as number[], async id => {
      [err] = await to(req.db.query('DELETE FROM shift WHERE shift_id = ?', id));
      if (err) return res.error(500, 'Error deleting shift', err);
    });
  }

  // Create/update shifts (delete is above)
  _.forEach(shifts as Shift[], async shift => {
    const values = {
      event_id: eventID,
      shift_num: shift.shift_num,
      max_spots: shift.max_spots,
      start_time: shift.start_time,
      end_time: shift.end_time,
      meals: shift.meals.join(),
      notes: shift.notes,
    };
    if (shift.shift_id === -1) {
      // Create new shift
      [err] = await to(req.db.query('INSERT INTO shift SET ?', values));
      if (err) return res.error(500, 'Error creating shift', err);
    } else {
      // Update shift
      let changedRows;
      [err, { changedRows }] = await to(
        req.db.query('UPDATE shift SET ? WHERE shift_id = ?', [values, shift.shift_id]),
      );
      if (err || changedRows !== 1) return res.error(500, 'Error updating shift', err);
    }
  });

  res.success(
    `Event ${eventID === -1 ? 'added' : 'updated'} successfully`,
    eventID === -1 ? 201 : 200,
  );
});

// Delete event
api.delete('/events/:id', async (req, res) => {
  if (req.user.role_id < ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, affectedRows;
  [err, { affectedRows }] = await to(
    req.db.query('DELETE FROM event WHERE event_id = ?', [req.params.id]),
  );
  if (err || affectedRows !== 1) return res.error(500, 'Error deleting to database', err);
  res.success('Event deleted successfully', 202);
});

// Signup
api.post('/signup', async (req, res) => {
  // Get user id from email
  let err, users: { user_id: number }[];
  [err, users] = await to(
    req.db.query('SELECT user_id FROM user WHERE email = ?', [req.user.email]),
  );
  if (err || !users[0] || !users[0].user_id) {
    // lack of existence of users[0].user_id means user couldn't be found
    return res.error(500, 'Error retrieving user information', err);
  }

  const values = (req.body.shifts as number[]).map(shift => [users[0].user_id, shift]);

  let affectedRows;
  [err, { affectedRows }] = await to(
    req.db.query('INSERT INTO user_shift (user_id, shift_id) VALUES ?', [values]),
  );
  if (err || affectedRows !== 1) return res.error(500, 'Error signing up', err);

  res.success('Signed up successfully', 201);
});

// 404
api.get('*', (req, res) => {
  res.error(404, 'Unknown endpoint');
});

export default api;
