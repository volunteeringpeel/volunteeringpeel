/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as jwt from 'express-jwt';
import * as fs from 'fs-extra';
import * as jwksRsa from 'jwks-rsa';
import * as multer from 'multer';

import * as Utilities from '@api/utilities';

// Import sub-APIs
import * as AttendanceAPI from '@api/attendance';
import db from '@api/db';
import * as EventAPI from '@api/event';
import * as HeaderAPI from '@api/header';
import * as MailingListAPI from '@api/mailing-list';
import * as UserAPI from '@api/user';
import { wss } from '..';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { Event } from '@api/models/Event';
import { FAQ } from '@api/models/FAQ';
import { MailList } from '@api/models/MailList';
import { Role } from '@api/models/Role';
import { Shift } from '@api/models/Shift';
import { Sponsor } from '@api/models/Sponsor';
import { User } from '@api/models/User';
import { UserMailList } from '@api/models/UserMailList';
import { UserShift } from '@api/models/UserShift';

// Initialize API
const api = Express.Router();

// SQL setup
db.sequelize.addModels([
  ConfirmLevel,
  Event,
  FAQ,
  MailList,
  Role,
  Shift,
  Sponsor,
  User,
  UserMailList,
  UserShift,
]);

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
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
    console.error(`[${new Date().toISOString()}] error ${error}`);
    console.error(details);
    res
      .status(status)
      .json({ error, details: details || 'No further information', status: 'error' });
  };

  res.success = async (data, status = 200) => {
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
    if (req.user) {
      const [err, data] = await to(
        User.findOne({
          where: { email: req.user.email },
          attributes: [],
          include: [{ model: Role }],
        }),
      );
      if (err) res.error(500, 'User does not exist', err);
      // only assign role_id if it exists, otherwise 0
      req.user.role_id = data ? data.role.role_id : 0;
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
    let err, faqs: FAQ[];
    [err, faqs] = await to(
      FAQ.findAll({ order: ['priority'], attributes: ['question', 'answer', 'faq_id'] }),
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
      [err] = await to(FAQ.update({ question, answer }, { where: { faq_id: req.params.id } }));
      if (err) return res.error(500, 'Error updating FAQ', err);
    } else {
      [err] = await to(FAQ.create({ question, answer }));
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
      User.findAll({
        where: { show_exec: true },
        attributes: ['user_id', 'first_name', 'last_name', 'title', 'bio', 'pic'],
        include: [{ model: Role, where: { role_id: Utilities.ROLE_EXECUTIVE } }],
      }),
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
      Sponsor.findAll({
        order: ['priority'],
        attributes: ['sponsor_id', 'name', 'image', 'website', 'priority'],
      }),
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

    [err] =
      // create if id is negative
      id < 0
        ? await to(Sponsor.create(data))
        : await to(Sponsor.update(data, { where: { sponsor_id: req.params.id } }));

    if (err) return res.error(500, 'Failed to process sponsor data', err);
    res.success('Sponsor processed successfully', id < 0 ? 201 : 200);
  }),
);
api.delete(
  '/sponsor/:id',
  Utilities.asyncMiddleware(async (req, res) => {
    if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');
    const [err, affectedRows] = await to(Sponsor.destroy({ where: { sponsor_id: req.params.id } }));
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
    let err, user: User;
    [err, user] = await to(
      // req.db.query('SELECT user_id FROM user WHERE email = ?', [req.user.email]),
      User.findOne({ where: { email: req.user.email } }),
    );
    if (err || !user) {
      // lack of existence of users[0].user_id means user couldn't be found
      return res.error(500, 'Error retrieving user information', err);
    }

    const values = (req.body.shifts as number[]).map(shift => ({
      user_id: user.user_id,
      shift_id: shift,
      add_info: req.body.add_info,
    }));

    let rows: UserShift[];
    [err, rows] = await to(UserShift.bulkCreate(values));
    if (err || rows.length !== req.body.shifts.length) {
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

// error handling
api.use((err: Error, req: Express.Request, res: Express.Response) => {
  console.error(`[${new Date().toISOString()}] uncaught error ${err}`);
  console.error(err.stack);
  res.status(500).send({ status: 'error', error: err });
});

export default api;
