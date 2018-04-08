/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// Import sub-APIs
import * as EventAPI from '@api/event';
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
  // Return functions
  res.error = async (status, error, details) => {
    if (req.db) {
      await req.db.rollback();
      req.db.release();
    }
    res
      .status(status)
      .json({ error, details: details || 'No further information', status: 'error' });
  };

  res.success = async (data, status = 200) => {
    if (req.db) {
      [err] = await to(req.db.commit());
      if (err) return res.error(500, 'Error saving changes', err);
      req.db.release();
    }
    if (data) res.status(status).json({ data, status: 'success' });
    else res.status(status).json({ status: 'success' });
  };

  // Store db connection inside of req for access by other API files
  let err;
  [err, req.db] = await to(pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err);
  [err] = await to(req.db.beginTransaction());
  if (err) return res.error(500, 'Error opening transaction', err);

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

// Prived/authorized by JWT endpoint
api.get('/event', EventAPI.eventQuery(true));
// Endpoint doesn't require JWT (i.e. not logged in)
api.get('/public/event', EventAPI.eventQuery(false));
// Edit event
api.post('/event/:id', EventAPI.editEvent);
// Delete event
api.delete('/event/:id', EventAPI.deleteEvent);

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
