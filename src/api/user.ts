/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// Import API core
import * as API from '@api/api';

export async function getAllUsers(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, db: mysql.PoolConnection, users: User[];

  [err, db] = await to(req.pool.getConnection());
  if (err) res.error(500, 'Error connecting to database', err, db);

  [err, users] = await to(db.query('SELECT * from user'));
  if (err) res.error(500, 'Error getting user data', err, db);

  // get mailing list data
  users = await Promise.all(
    users.map(async user => {
      let mailLists;
      [err, mailLists] = await to(Bluebird.resolve(getUserMailLists(user.email, db)));
      if (err) res.error(500, 'Error getting mail list data', err, db);
      return { ...user, mail_lists: mailLists };
    }),
  );

  res.success(users, 200, db);
}

export async function getCurrentUser(req: Express.Request, res: Express.Response) {
  let err, db: mysql.PoolConnection, user: User, result: any;

  const out: UserData = {
    user: null,
    new: false,
    userShifts: [],
  };

  [err, db] = await to(req.pool.getConnection());
  if (err) res.error(500, 'Error connecting to database', err, db);
  // Try selecting a user
  [err, user] = await to(
    db.query('SELECT * from user WHERE email = ?', [req.user.email]).then(__ => __[0]),
  );
  if (err) res.error(500, 'Error searching for user', err, db);

  // User does not exist, create a new user account
  if (!user) {
    console.log(req.user);
    // tslint:disable-next-line:variable-name
    const [first_name, last_name] = req.user.name ? req.user.name.split(/ (.+)/) : ['', ''];
    const newUser: User = {
      // might be the same as email cause auth0 is weird af
      first_name,
      // the name can be email if none is provided by auth0,
      // so if last name isn't a thing, make it a blank string
      last_name: last_name || '',
      email: req.user.email,
      phone_1: null as string,
      phone_2: null as string,
      role_id: 1,
      mail_lists: [],
    };

    [err, result] = await to(db.query('INSERT INTO user SET ?', newUser));
    if (err) res.error(500, 'Error creating user', err, db);

    out.user = newUser;
    out.user.user_id = result.insertId;
    out.new = true;
  } else {
    out.user = user;
  }

  // Get shifts
  let userShifts: any[];
  [err, userShifts] = await to(
    db.query(`SELECT * from vw_user_shift WHERE user_id = ?`, [user.user_id]),
  );
  if (err) res.error(500, 'Error finding user shifts', err, db);
  out.userShifts = _.map(userShifts, userShift => ({
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
      meals: userShift.meals,
      notes: userShift.notes,
    },
    parentEvent: {
      event_id: +userShift.event_id,
      name: userShift.name,
    },
  }));

  // Mail lists
  [err, out.user.mail_lists] = await to(Bluebird.resolve(getUserMailLists(out.user.email, db)));
  if (err) res.error(500, 'Error finding mail list data', err, db);
  res.success(out, out.new ? 201 : 200, db);
}

export async function deleteUser(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) res.error(500, 'Error connecting to database', err, db);
  // Delete user
  [err] = await to(db.query('DELETE FROM user WHERE user_id = ?', [req.params.id]));
  if (err) res.error(500, 'Error deleting user', err, db);

  res.success('User deleted successfully', 200, db);
}

export async function updateUser(req: Express.Request, res: Express.Response) {
  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) res.error(500, 'Error connecting to database', err, db);

  // updating own user
  if (req.params.id === 'current') {
    // get parameters from request body
    const { first_name, last_name, phone_1, phone_2, mail_list, bio, title } = req.body;
    // ensure that all parameters exist
    if (!first_name || !last_name || !phone_1) {
      return res.error(
        400,
        'Missing required field!',
        'Hmmm...the website should have stopped you from doing this.',
      );
    }

    // update the profile in the database
    let result;
    [err, result] = await to(
      db.query('UPDATE user SET ? WHERE ?', [
        // fields to update
        { first_name, last_name, phone_1, phone_2, bio, title, mail_list: +mail_list },
        // find the user with this email
        { email: req.user.email },
      ]),
    );
    if (err) res.error(500, 'Error updating user', err, db);

    if (result.affectedRows !== 1) {
      res.error(500, 'Profile could not update.', 'Please try again or contact us for help.', db);
    } else {
      res.success('Profile updated successfully', 200, db);
    }
  } else {
    // updating another user, so you need admin permissions
    if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

    // get parameters from request body
    const {
      first_name,
      last_name,
      email,
      phone_1,
      phone_2,
      role_id,
      mail_list,
      bio,
      title,
    } = req.body;

    const data = { first_name, last_name, email, phone_1, phone_2, role_id, mail_list, bio, title };

    if (+req.params.id === -1) {
      [err] = await to(db.query('INSERT INTO user SET ?', data));
      if (err) res.error(500, 'Error creating user', err, db);
    } else {
      [err] = await to(
        db.query('UPDATE user SET ? WHERE ?', [
          // fields to update
          data,
          // find the user with this email
          { user_id: req.params.id },
        ]),
      );
      if (err) res.error(500, 'Error updating user data', err, db);
    }

    res.success(`User ${req.params.id === -1 ? 'added' : 'updated'} successfully`, 200, db);
  }
}

export async function getUserMailLists(
  email: string,
  db: mysql.PoolConnection,
): Promise<MailList[]> {
  return db.query(
    `SELECT
      mail_list_id, display_name, description,
      (CASE WHEN email = ? THEN 1 ELSE 0 END) subscribed
      FROM vw_user_mail_list
      GROUP BY mail_list_id`,
    email,
  );
}
