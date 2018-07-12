/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mv from 'mv';
import * as mysql from 'promise-mysql';

// Import API core
import * as Utilities from '@api/utilities';

export const getAllUsers = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // default parameters just in case something stupid happens
  const page = +req.query.page || 1;
  const pageSize = +req.query.page_size || 20;

  let err, users: Exec[];
  [err, users] = await to(
    req.db.query(
      `SELECT
        user_id, role_id,
        first_name, last_name,
        email, phone_1, phone_2, school,
        title, bio, pic, show_exec
      FROM user
      LIMIT ? OFFSET ?`,
      [pageSize, pageSize * (page - 1)],
    ),
  );
  if (err) return res.error(500, 'Error getting user data', err);

  [err, users] = await to(
    Bluebird.all(
      users.map(async user => {
        // get mailing list data
        const mailLists = await Bluebird.resolve(getUserMailLists(user.user_id, req.db));
        const shifts = await Bluebird.resolve(getUserShifts(user.user_id, req.db));
        const shiftHistory = _.countBy(shifts, 'confirmLevel.id');
        return { ...user, shiftHistory, show_exec: !!+user.show_exec, mail_lists: mailLists };
      }),
    ),
  );
  if (err) return res.error(500, 'Error getting mail list data', err);

  // get human-readable confirm levels
  let confirmLevels: ConfirmLevel[];
  [err, confirmLevels] = await to(
    req.db.query('SELECT confirm_level_id as id, name, description FROM confirm_level'),
  );
  if (err) return res.error(500, 'Error retrieving attendance statuses', err);

  // get number of pages (for pagination)
  let userCount: any[];
  [err, userCount] = await to(req.db.query('SELECT COUNT(*) FROM user'));
  if (err) return res.error(500, 'Error counting users', err);
  const lastPage = Math.ceil(userCount[0]['COUNT(*)'] / pageSize);

  res.success({ users, confirmLevels, lastPage }, 200);
});

export const getCurrentUser = Utilities.asyncMiddleware(async (req, res) => {
  let err;

  const out: UserData = {
    user: null,
    new: false,
    userShifts: [],
  };

  // Try selecting a user
  let user: User;
  [err, user] = await to(
    req.db
      .query(
        `SELECT
          user_id,
          first_name, last_name, email, school,
          phone_1, phone_2, role_id,
          bio, title, pic, show_exec
        FROM user WHERE email = ?`,
        [req.user.email],
      )
      .then(__ => __[0]),
  );
  if (err) return res.error(500, 'Error searching for user', err);

  // User does not exist, create a new user account
  if (!user) {
    // tslint:disable-next-line:variable-name
    const [first_name, last_name] = req.user.name ? req.user.name.split(/ (.+)/) : ['', ''];
    const newUser = {
      // might be the same as email cause auth0 is weird af
      first_name: first_name || '',
      // the name can be email if none is provided by auth0,
      // so if last name isn't a thing, make it a blank string
      last_name: last_name || '',
      email: req.user.email,
      role_id: 1,
    };

    let result: any;
    [err, result] = await to(req.db.query('INSERT INTO user SET ?', [newUser]));
    if (err) return res.error(500, 'Error creating user', err);

    out.user = { ...newUser, phone_1: null, phone_2: null, school: null };
    out.user.user_id = result.insertId;
    out.new = true;
  } else {
    out.user = user;
  }

  // Get shifts
  [err, out.userShifts] = await to(Bluebird.resolve(getUserShifts(out.user.user_id, req.db)));
  if (err) return res.error(500, 'Error finding user shifts', err);

  // Mail lists
  [err, out.user.mail_lists] = await to(
    Bluebird.resolve(getUserMailLists(out.user.user_id, req.db)),
  );
  if (err) return res.error(500, 'Error finding mail list data', err);
  res.success(out, out.new ? 201 : 200);
});

export const deleteUser = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // Delete user
  let err;
  [err] = await to(req.db.query('DELETE FROM user WHERE user_id = ?', [req.params.id]));
  if (err) return res.error(500, 'Error deleting user', err);

  res.success('User deleted successfully', 200);
});

export const updateUser = Utilities.asyncMiddleware(async (req, res) => {
  let err;

  // get parameters from request body
  const {
    first_name,
    last_name,
    phone_1,
    phone_2,
    school,
    mail_lists,
    bio,
    title,
    show_exec,
  }: Exec = req.body;

  // updating own user
  if (req.params.id === 'current') {
    // ensure that all parameters exist
    if (!first_name || !last_name || !phone_1 || !school) {
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
        { first_name, last_name, phone_1, phone_2, school, bio, title },
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
    if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

    // get parameters from request body
    const { email, role_id }: User = req.body;
    const pic = req.file ? req.file.filename : null;
    if (pic) {
      [err] = await to(
        Bluebird.promisify(mv)(req.file.path, `${global.appDir}/upload/user/${req.file.filename}`),
      );
      if (err) return res.error(500, 'Failed to save uploaded file', err);
    }

    const data = {
      first_name,
      last_name,
      email,
      phone_1,
      phone_2,
      school,
      role_id,
      bio,
      title,
      pic,
      show_exec: +show_exec,
    };

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

      [err] = await to(
        Bluebird.resolve(
          updateUserMailLists(req.params.id, JSON.parse(req.body.mail_lists), req.db),
        ),
      );
      if (err) return res.error(500, 'Error updating mail lists', err);
    }

    res.success(`User ${req.params.id === -1 ? 'added' : 'updated'} successfully`, 200);
  }
});

export async function getUserShifts(id: number, db: mysql.PoolConnection): Promise<any[]> {
  return _.map(
    await db.query(
      `SELECT
        user_shift_id, user_id,
        confirm_level_id, confirm_level, confirm_description,
        shift_id, shift_num,
        start_time, end_time, hours, meals, notes
        event_id, name, address, transport, description, letter
      FROM vw_user_shift WHERE user_id = ?`,
      [id],
    ),
    userShift => ({
      user_shift_id: +userShift.user_shift_id,
      confirmLevel: {
        id: +userShift.confirm_level_id,
        name: userShift.confirm_level,
        description: userShift.confirm_description,
      },
      hours: userShift.hours,
      letter: userShift.letter,
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
    }),
  );
}

export async function getUserMailLists(id: number, db: mysql.PoolConnection): Promise<MailList[]> {
  return _.map(
    await db.query(
      `SELECT m.mail_list_id, m.display_name, m.description, NOT ISNULL(user_mail_list_id) subscribed
      FROM user u
      JOIN mail_list m
      LEFT JOIN user_mail_list uml on uml.user_id = u.user_id AND uml.mail_list_id = m.mail_list_id
      WHERE u.user_id = ?`,
      [id],
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
    Promise.all(
      mailLists.map(async list => {
        if (list.subscribed) {
          return db.query('INSERT INTO user_mail_list SET ?', {
            user_id: id,
            mail_list_id: list.mail_list_id,
          });
        }
      }),
    ),
  );
}
