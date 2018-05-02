/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as jwksRsa from 'jwks-rsa';
import * as _ from 'lodash';
import * as multer from 'multer';
import * as mysql from 'promise-mysql';

// Roles
export const ROLE_VOLUNTEER = 1;
export const ROLE_ORGANIZER = 2;
export const ROLE_EXECUTIVE = 3;
export const asyncMiddleware: ((fn: Express.RequestHandler) => Express.RequestHandler) = fn => (
  req,
  res,
  next,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Import sub-APIs
import * as AttendanceAPI from '@api/attendance';
import * as EventAPI from '@api/event';
import * as MailingListAPI from '@api/mailing-list';
import * as UserAPI from '@api/user';
import { wss } from '../index';

// Initialize API
const api = Express.Router();

// Setup MySQL
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'volunteeringpeel',
  charset: 'utf8mb4',
});

if (process.env.NODE_ENV !== 'production') {
  api.use((req, res, next) => {
    console.log(`Request: ${req.originalUrl} (${req.method})`);
    next();
  });
}

// configuring Multer to use files directory for storing files
// this is important because later we'll need to access file path
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, global.appDir + '/upload');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

api.use(
  jwt({
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
  }).unless({ path: [/\/public*/, /.*\/ws/] }),
);

api.use((err: any, req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    res.error((err as jwt.UnauthorizedError).status, (err as jwt.UnauthorizedError).message);
  }
});

// Success/error functions
api.use(
  asyncMiddleware(async (req, res, next) => {
    if (req.path.indexOf('/ws') > -1) return next();
    // Return functions
    res.error = async (status, error, details) => {
      if (req.db) {
        // await req.db.rollback();
        req.db.release();
      }
      res
        .status(status)
        .json({ error, details: details || 'No further information', status: 'error' });
    };

    res.success = async (data, status = 200) => {
      if (req.db) {
        // [err] = await to(req.db.commit());
        // if (err) return res.error(500, 'Error saving changes', err);
        req.db.release();
      }
      if (data) res.status(status).json({ data, status: 'success' });
      else res.status(status).json({ status: 'success' });
    };

    // Store db connection inside of req for access by other API files
    let err;
    [err, req.db] = await to(pool.getConnection());
    if (err) return res.error(500, 'Error connecting to database', err);
    // [err] = await to(req.db.beginTransaction());
    // if (err) return res.error(500, 'Error opening transaction', err);

    if (req.user) {
      [err, [{ role_id: req.user.role_id }]] = await to(
        req.db.query('SELECT role_id FROM user WHERE email = ?', [req.user.email]),
      );
    }

    next();
  }),
);

// Get all users
api.get('/user', UserAPI.getAllUsers);
// Create or update user
api.post('/user/:id', upload.single('pic'), UserAPI.updateUser);
// Delete user
api.delete('/user/:id', UserAPI.deleteUser);
// Get current user
api.get('/user/current', UserAPI.getCurrentUser);

// WebSocket
api.ws('/attendance/ws', AttendanceAPI.webSocket);
export const attendanceWss = wss.getWss('/api/attendance/ws');

// Get all mailing lists
api.get('/mailing-list', MailingListAPI.getMailingList);
// Create or update mailing list
api.post('/mailing-list/:id', MailingListAPI.updateMailingList);
// Delete mailing list
api.delete('/mailing-list/:id', MailingListAPI.deleteMailingList);
// Signup to mailing list id
api.post('/public/mailing-list/:id', MailingListAPI.signup);

// FAQ's
api.get(
  '/public/faq',
  asyncMiddleware(async (req, res) => {
    let err, faqs;
    [err, faqs] = await to(req.db.query('SELECT question, answer FROM faq ORDER BY priority'));
    if (err) return res.error(500, 'Error retrieving FAQs', err);
    res.success(faqs, 200);
  }),
);

// Execs
api.get(
  '/public/execs',
  asyncMiddleware(async (req, res) => {
    let err, execs;
    [err, execs] = await to(
      req.db.query(
        'SELECT user_id, first_name, last_name, title, bio, pic FROM user WHERE role_id = 3',
      ),
    );
    if (err) return res.error(500, 'Error retrieving executive data', err);
    res.success(execs, 200);
  }),
);

// Sponsors
api.get(
  '/public/sponsors',
  asyncMiddleware(async (req, res) => {
    let err, sponsors;
    [err, sponsors] = await to(
      req.db.query('SELECT name, image, website FROM sponsor ORDER BY priority'),
    );
    if (err) return res.error(500, 'Error retrieving sponsor data', err);
    res.success(sponsors, 200);
  }),
);

// Prived/authorized by JWT endpoint
api.get('/event', EventAPI.eventQuery(true));
// Endpoint doesn't require JWT (i.e. not logged in)
api.get('/public/event', EventAPI.eventQuery(false));
// Edit event
api.post('/event/:id', upload.single('letter'), EventAPI.editEvent);
// Delete event
api.delete('/event/:id', EventAPI.deleteEvent);

// Signup
api.post(
  '/signup',
  asyncMiddleware(async (req, res) => {
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
    if (err || affectedRows !== req.body.shifts.length) {
      return res.error(500, 'Error signing up', err);
    }

    res.success('Signed up successfully', 201);
  }),
);

// 404
api.get('*', (req, res, next) => {
  if (req.headers.upgrade === 'websocket') res.end();
  res.error(404, 'Unknown endpoint');
});

export default api;
