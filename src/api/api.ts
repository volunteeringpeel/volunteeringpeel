/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as fs from 'fs-extra';
import * as jwksRsa from 'jwks-rsa';
import * as _ from 'lodash';
import * as multer from 'multer';
import * as nodemailer from 'nodemailer';
import * as mysql from 'promise-mysql';

import * as Utilities from '@api/utilities';

// Import sub-APIs
import { listify, pluralize } from '@api/../utilities';
import * as AttendanceAPI from '@api/attendance';
import * as EventAPI from '@api/event';
import * as HeaderAPI from '@api/header';
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
  timezone: '-04:00',
  connectionLimit: 100,
});

// Setup nodemailer
export const transporter = nodemailer.createTransport(
  {
    host: 'smtpout.secureserver.net',
    secure: true,
    auth: {
      user: 'no_reply@volunteeringpeel.org',
      pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
      // do not fail on invalid certs
      rejectUnauthorized: false,
    },
  },
  { from: 'no_reply@volunteeringpeel.org' },
);
transporter.verify(error => {
  if (error) {
    console.error(error);
  } else {
    console.log('Mailserver connection ready');
  }
});

// if (process.env.NODE_ENV !== 'production') {
api.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] request ${req.originalUrl} (${req.method})`);
  next();
});
// }

// configuring Multer to use files directory for storing files
// this is important because later we'll need to access file path
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/tmp');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// JSON middleware
api.use((req, res, next) => {
  // Return functions
  res.error = async (status, error, details) => {
    if (req.db) {
      // await req.db.rollback();
      req.db.release();
    }
    console.error(`[${new Date().toISOString()}] error ${error}`);
    console.error(details);
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
    console.log(`[${new Date().toISOString()}] success ${data}`);
    if (data) res.status(status).json({ data, status: 'success' });
    else res.status(status).json({ status: 'success' });
  };

  next();
});

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

// Database middleware
api.use(
  Utilities.asyncMiddleware(async (req, res, next) => {
    if (req.path.indexOf('/ws') > -1) return next();

    // Store db connection inside of req for access by other API files
    let err;
    [err, req.db] = await to(pool.getConnection());
    if (err) return res.error(500, 'Error connecting to database', err);
    // [err] = await to(req.db.beginTransaction());
    // if (err) return res.error(500, 'Error opening transaction', err);

    if (req.user) {
      let data;
      [err, data] = await to(
        req.db.query('SELECT role_id FROM user WHERE email = ?', [req.user.email]),
      );
      // only assign role_id if it exists, otherwise 0
      req.user.role_id = data && data[0] && data[0].role_id ? data[0].role_id : 0;
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
// Export as CSV
api.get('/attendance/csv/:id', AttendanceAPI.exportToCSV);

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
  Utilities.asyncMiddleware(async (req, res) => {
    let err, faqs;
    [err, faqs] = await to(
      req.db.query('SELECT question, answer, faq_id FROM faq ORDER BY priority'),
    );
    if (err) return res.error(500, 'Error retrieving FAQs', err);
    res.success(faqs, 200);
  }),
);
api.post(
  '/faq/:id',
  Utilities.asyncMiddleware(async (req, res) => {
    let err;
    const { question, answer } = req.body;
    const id = +req.params.id;
    if (id > 0) {
      [err] = await to(
        req.db.query('UPDATE faq SET ? WHERE faq_id = ?', [{ question, answer }, req.params.id]),
      );
      if (err) return res.error(500, 'Error updating FAQ', err);
    } else {
      [err] = await to(req.db.query('INSERT INTO faq SET ?', [{ question, answer }]));
      if (err) return res.error(500, 'Error creating FAQ', err);
    }
    return res.success('FAQ processed successfully', id > 0 ? 200 : 201);
  }),
);

// Execs
api.get(
  '/public/execs',
  Utilities.asyncMiddleware(async (req, res) => {
    let err, execs;
    [err, execs] = await to(
      req.db.query(
        'SELECT user_id, first_name, last_name, title, bio, pic FROM user WHERE role_id = 3 AND show_exec = 1',
      ),
    );
    if (err) return res.error(500, 'Error retrieving executive data', err);
    res.success(execs, 200);
  }),
);

// Sponsors
api.get(
  '/public/sponsor',
  Utilities.asyncMiddleware(async (req, res) => {
    let err, sponsors;
    [err, sponsors] = await to(
      req.db.query(
        'SELECT sponsor_id, name, image, website, priority FROM sponsor ORDER BY priority',
      ),
    );
    if (err) return res.error(500, 'Error retrieving sponsor data', err);
    res.success(sponsors, 200);
  }),
);
api.post(
  '/sponsor/:id',
  upload.single('pic'),
  Utilities.asyncMiddleware(async (req, res) => {
    if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
    const { name, website, priority } = req.body;
    const data: any = { name, website, priority };
    const id = +req.params.id;
    let err;
    if (req.file) {
      [err] = await to(
        Bluebird.resolve(
          fs.move(req.file.path, `${global.appDir}/upload/sponsor/${req.file.filename}`),
        ),
      );
      if (err) return res.error(500, 'Failed to save uploaded file', err);
      data.image = req.file.filename;
    }
    if (id < 0) {
      [err] = await to(req.db.query('INSERT INTO sponsor SET ?', [data]));
    } else {
      [err] = await to(
        req.db.query('UPDATE sponsor SET ? WHERE sponsor_id = ?', [data, +req.params.id]),
      );
    }
    if (err) return res.error(500, 'Failed to process sponsor data', err);
    res.success('Sponsor processed successfully', id < 0 ? 201 : 200);
  }),
);
api.delete(
  '/sponsor/:id',
  Utilities.asyncMiddleware(async (req, res) => {
    if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
    const [err, { affectedRows }] = await to(
      req.db.query('DELETE FROM sponsor WHERE sponsor_id = ?', [+req.params.id]),
    );
    if (err || affectedRows < 1) return res.error(500, 'Failed to delete sponsor', err);
    res.success('Sponsor deleted successfully', 202);
  }),
);

// Header Images
api.get('/public/header-image', HeaderAPI.getHeaderImage);
api.get('/header-image', HeaderAPI.listHeaderImages);
api.post('/header-image', upload.single('header'), HeaderAPI.uploadHeaderImage);
api.delete('/header-image/:filename', HeaderAPI.deleteHeaderImage);

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
  Utilities.asyncMiddleware(async (req, res) => {
    // Get user id from email
    let err, users: Partial<User>[];
    [err, users] = await to(
      req.db.query('SELECT user_id, first_name FROM user WHERE email = ?', [req.user.email]),
    );
    if (err || !users[0] || !users[0].user_id) {
      // lack of existence of users[0].user_id means user couldn't be found
      return res.error(500, 'Error retrieving user information', err);
    }

    const values = (req.body.shifts as number[]).map(shift => [
      users[0].user_id,
      shift,
      req.body.add_info,
    ]);

    let result;
    [err, result] = await to(
      req.db.query('INSERT INTO user_shift (user_id, shift_id, add_info) VALUES ?', [values]),
    );
    if (err || result.affectedRows !== req.body.shifts.length) {
      return res.error(500, 'Error signing up', err);
    }

    // Text for confirm modal on submit (sort shift numbers first)
    const shiftsList = listify(_.sortBy(req.body.readable_nums), '#');
    // Pluralization
    const shiftPlural = pluralize('shift', req.body.readable_nums.length);
    const emailText = `Hi ${users[0].first_name}!<br />
    <br />
    You have been successfully signed up for <b>${req.body.event}</b> ${shiftPlural}
    ${shiftsList}.<br />
    You will receive another email with further details a week prior to the event. We look forward to seeing you at the event!

    Please do not reply to this email. For any inquiries, or if you cannot attend the event, please email <a href="mailto:info@volunteeringpeel.org">info@volunteeringpeel.org<a>.
    `;

    transporter.sendMail(
      {
        to: req.user.email,
        subject: `Signup Confirmation: ${req.body.event}`,
        html: emailText,
      },
      (error, info) => {
        if (error) console.error(error);
        else console.log(info.response);
      },
    );

    res.success('Signed up successfully', 201);
  }),
);

// 404
api.get('*', (req, res, next) => {
  if (req.headers.upgrade === 'websocket') res.end();
  res.error(404, 'Unknown endpoint');
});

// error handling
api.use((err: Error, req: Express.Request, res: Express.Response) => {
  console.error(`[${new Date().toISOString()}] uncaught error ${err}`);
  console.error(err.stack);
  res.status(500).send({ status: 'error', error: err });
});

export default api;
