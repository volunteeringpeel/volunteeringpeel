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

  let err, users: User[];
  [err, users] = await to(req.db.query('SELECT * from user'));
  if (err) return res.error(500, 'Error getting user data', err);

  // get mailing list data
  [err, users] = await to(
    Bluebird.all(
      users.map(async user => {
        const mailLists = await Bluebird.resolve(getUserMailLists(user.user_id, req.db));
        return { ...user, mail_lists: mailLists };
      }),
    ),
  );
  if (err) return res.error(500, 'Error getting mail list data', err);

  res.success(users, 200);
}

export async function getCurrentUser(req: Express.Request, res: Express.Response) {
  let err;

  const out: UserData = {
    user: null,
    new: false,
    userShifts: [],
  };

  // Try selecting a user
  let user: User;
  [err, user] = await to(
    req.db.query('SELECT * from user WHERE email = ?', [req.user.email]).then(__ => __[0]),
  );
  if (err) return res.error(500, 'Error searching for user', err);

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
    };

    let result: any;
    [err, result] = await to(req.db.query('INSERT INTO user SET ?', newUser));
    if (err) return res.error(500, 'Error creating user', err);

    out.user = newUser;
    out.user.user_id = result.insertId;
    out.new = true;
  } else {
    out.user = user;
  }

  // Get shifts
  let userShifts: any[];
  [err, userShifts] = await to(
    req.db.query(`SELECT * from vw_user_shift WHERE user_id = ?`, [user.user_id]),
  );
  if (err) return res.error(500, 'Error finding user shifts', err);
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
  [err, out.user.mail_lists] = await to(
    Bluebird.resolve(getUserMailLists(out.user.user_id, req.db)),
  );
  if (err) return res.error(500, 'Error finding mail list data', err);
  res.success(out, out.new ? 201 : 200);
}

export async function deleteUser(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // Delete user
  let err;
  [err] = await to(req.db.query('DELETE FROM user WHERE user_id = ?', [req.params.id]));
  if (err) return res.error(500, 'Error deleting user', err);

  res.success('User deleted successfully', 200);
}

export async function updateUser(req: Express.Request, res: Express.Response) {
  let err;

  // get parameters from request body
  const { first_name, last_name, phone_1, phone_2, mail_lists, bio, title }: Exec = req.body;

  // updating own user
  if (req.params.id === 'current') {
    // ensure that all parameters exist
    if (!first_name || !last_name || !phone_1) {
      return res.error(
        400,
        'Missing required field!',
        'Hmmm...the website should have stopped you from doing this.',
      );
    }

    // get user id
    let id;
    [err, [{ user_id: id }]] = await to(
      req.db.query('SELECT user_id FROM user WHERE email = ?', req.user.email),
    );
    if (err) return res.error(500, 'Error finding user records', err);

    // update the profile in the database
    let result;
    [err, result] = await to(
      req.db.query('UPDATE user SET ? WHERE ?', [
        // fields to update
        { first_name, last_name, phone_1, phone_2, bio, title },
        // find the user with this email
        { user_id: id },
      ]),
    );
    if (err) return res.error(500, 'Error updating user', err);

    if (result.affectedRows !== 1) {
      return res.error(
        500,
        'Profile could not update.',
        'Please try again or contact us for help.',
      );
    }

    // update mail lists
    [err] = await to(Bluebird.resolve(updateUserMailLists(id, mail_lists, req.db)));
    if (err) return res.error(500, 'Error updating mail lists', err);

    res.success('Profile updated successfully', 200);
  } else {
    // updating another user, so you need admin permissions
    if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

    // get parameters from request body
    const { email, role_id }: User = req.body;

    const data = { first_name, last_name, email, phone_1, phone_2, role_id, bio, title };

    if (+req.params.id === -1) {
      [err] = await to(req.db.query('INSERT INTO user SET ?', data));
      if (err) return res.error(500, 'Error creating user', err);
    } else {
      [err] = await to(
        req.db.query('UPDATE user SET ? WHERE ?', [
          // fields to update
          data,
          // find the user with this email
          { user_id: req.params.id },
        ]),
      );
      if (err) return res.error(500, 'Error updating user data', err);

      [err] = await to(Bluebird.resolve(updateUserMailLists(req.params.id, mail_lists, req.db)));
      if (err) return res.error(500, 'Error updating mail lists', err);
    }

    res.success(`User ${req.params.id === -1 ? 'added' : 'updated'} successfully`, 200);
  }
}

export async function getUserMailLists(id: number, db: mysql.PoolConnection): Promise<MailList[]> {
  return _.map(
    await db.query(
      `SELECT m.mail_list_id, m.display_name, m.description, NOT ISNULL(user_mail_list_id) subscribed
      FROM user u
      JOIN mail_list m
      LEFT JOIN user_mail_list uml on uml.user_id = u.user_id AND uml.mail_list_id = m.mail_list_id
      WHERE u.user_id = ?`,
      id,
    ),
    (list: MailList) => ({ ...list, subscribed: !!list.subscribed }),
  );
}

export async function updateUserMailLists(
  id: number,
  mailLists: MailList[],
  db: mysql.PoolConnection,
): Promise<any> {
  // update mail list data
  return db.query('DELETE FROM user_mail_list WHERE user_id = ?', id).then(() =>
    mailLists.map(async list => {
      if (list.subscribed) {
        return db.query('INSERT INTO user_mail_list SET ?', {
          user_id: id,
          mail_list_id: list.mail_list_id,
        });
      }
    }),
  );
}
