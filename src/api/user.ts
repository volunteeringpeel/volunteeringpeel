/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as fs from 'fs-extra';
import * as _ from 'lodash';

// Import API core
import db from '@api/db';
import * as Utilities from '@api/utilities';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { MailList } from '@api/models/MailList';
import { Role } from '@api/models/Role';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';
import { UserMailList } from '@api/models/UserMailList';

const Op = db.Sequelize.Op;

export const getAllUsers = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // default parameters just in case something stupid happens
  const page = +req.query.page || 1;
  const pageSize = +req.query.page_size || 20;
  const sortCol = req.query.sort || 'user_id';
  const sortDir = req.query.sort_dir || 'ascending';
  const search = req.query.search || '';
  const filters = JSON.parse(req.query.filters || []) || [];

  // list of searchable columns
  const searchable = ['first_name', 'last_name', 'email', 'phone_1', 'phone_2'];
  const searchQuery = searchable.map(col => ({ [col]: { [Op.like]: `%${search}%` } }));

  // convert to sql ASC/DESC
  // not escaped since it can only be ASC or DESC
  let sortDirSql = 'ASC';
  if (sortDir === 'descending') sortDirSql = 'DESC';

  // generate conditions (search AND filters)
  const conditions = { [Op.and]: [{ [Op.or]: searchQuery }, ...filters] };

  let err, result;
  [err, result] = await to(
    User.findAndCountAll({
      where: conditions,
      order: [[sortCol, sortDirSql]],
      limit: pageSize,
      offset: pageSize * (page - 1),
      attributes: [
        'user_id',
        'role_id',
        'first_name',
        'last_name',
        'email',
        'phone_1',
        'phone_2',
        'school',
        'title',
        'bio',
        'pic',
        'show_exec',
      ],
      include: [
        {
          model: Shift,
          required: false,
          attributes: [],
          through: { attributes: ['confirm_level_id'] },
        },
      ],
      logging: console.log,
    }),
  );
  if (err) return res.error(500, 'Error getting user data', err);

  const userData = result.rows;
  // get number of pages (for pagination)
  const lastPage = Math.ceil(result.count / pageSize);

  let users;
  [err, users] = await to(
    Bluebird.all(
      userData.map(async user => {
        const shiftHistory = _.countBy(user.userShifts, 'confirmLevel.id');
        return { ...user.dataValues, shiftHistory, show_exec: !!+user.show_exec };
      }),
    ),
  );
  if (err) return res.error(500, 'Error getting mail list data', err);

  // get human-readable confirm levels
  let confirmLevels: ConfirmLevel[];
  [err, confirmLevels] = await to(
    ConfirmLevel.findAll({ attributes: [['confirm_level_id', 'id'], 'name', 'description'] }),
  );
  if (err) return res.error(500, 'Error retrieving attendance statuses', err);

  res.success({ users, confirmLevels, lastPage }, 200);
});

export const getCurrentUser = Utilities.asyncMiddleware(async (req, res) => {
  let err;

  const out: VP.UserData = {
    user: null,
    new: false,
    userShifts: [],
  };

  // Try selecting a user
  let user;
  [err, user] = await to(
    User.findOne({
      where: { email: req.user.email },
      attributes: [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'school',
        'phone_1',
        'phone_2',
        'bio',
        'title',
        'pic',
        'show_exec',
        'role_id',
      ],
      include: [{ model: Role }, { model: MailList }],
    }),
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

    let entry;
    [err, entry] = await to(User.create(newUser));
    if (err) return res.error(500, 'Error creating user', err);

    out.user = entry.dataValues as VP.Exec;
    out.new = true;
  } else {
    out.user = user.dataValues as VP.Exec;
  }

  [err, out.user.mail_lists] = await to(Bluebird.resolve(getUserMailLists(out.user.user_id)));
  if (err) return res.error(500, 'Error finding mail list data', err);

  res.success(out, out.new ? 201 : 200);
});

export const deleteUser = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // Delete user
  let err;
  [err] = await to(User.destroy({ where: { user_id: req.params.id } }));
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
  } = req.body;

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

    let id;
    [err, { user_id: id }] = await to(
      User.findOne({ where: { email: req.user.email }, attributes: ['user_id'] }),
    );
    if (err) return res.error(500, 'Error updating user', err);

    // update the profile in the database
    let result;
    [err, result] = await to(
      User.update(
        { first_name, last_name, phone_1, phone_2, school, bio, title },
        { where: { user_id: id } },
      ),
    );
    if (err) return res.error(500, 'Error updating user', err);
    console.log(result);
    if (result[0] > 1) {
      return res.error(
        500,
        'Profile could not update.',
        'Please try again or contact us for help.',
      );
    }

    // update mail lists
    [err] = await to(Bluebird.resolve(updateUserMailLists(id, mail_lists)));
    if (err) return res.error(500, 'Error updating mail lists', err);

    res.success('Profile updated successfully', 200);
  } else {
    // updating another user, so you need admin permissions
    if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

    // get parameters from request body
    const { email, role_id } = req.body;
    const pic = req.file ? req.file.filename : null;
    if (pic) {
      [err] = await to(
        Bluebird.resolve(
          fs.move(req.file.path, `${global.appDir}/upload/user/${req.file.filename}`),
        ),
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
      show_exec,
    };

    if (+req.params.id === -1) {
      [err] = await to(User.create(data));
      if (err) return res.error(500, 'Error creating user', err);
    } else {
      [err] = await to(User.update(data, { where: { user_id: req.params.id } }));
      if (err) return res.error(500, 'Error updating user data', err);

      [err] = await to(
        Bluebird.resolve(updateUserMailLists(req.params.id, JSON.parse(req.body.mail_lists))),
      );
      if (err) return res.error(500, 'Error updating mail lists', err);
    }

    res.success(`User ${req.params.id === -1 ? 'added' : 'updated'} successfully`, 200);
  }
});

export async function getUserShifts(id: number): Promise<any[]> {
  return _.map(
    // TODO: figure out a way to use views with sequelize
    await db.sequelize.query(
      `SELECT
        user_shift_id, user_id,
        confirm_level_id, confirm_level, confirm_description,
        shift_id, shift_num,
        start_time, end_time, hours, meals, notes
        event_id, name, address, transport, description, letter
      FROM vw_user_shift WHERE user_id = ?`,
      { replacements: [id], type: db.Sequelize.QueryTypes.SELECT },
    ),
    ({ dataValues: userShift }) => ({
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

export async function getUserMailLists(id: number): Promise<VP.MailList[]> {
  return db.sequelize.query(
    `SELECT m.mail_list_id as mail_list_id, m.display_name as display_name, m.description as description, NOT ISNULL(user_mail_list_id) subscribed
      FROM user u
      JOIN mail_list m
      LEFT JOIN user_mail_list uml on uml.user_id = u.user_id AND uml.mail_list_id = m.mail_list_id
      WHERE u.user_id = ?`,
    { replacements: [id], type: db.Sequelize.QueryTypes.SELECT },
  );
}

export async function updateUserMailLists(id: number, mailLists: VP.MailList[]): Promise<any> {
  // update mail list data
  return UserMailList.destroy({ where: { user_id: id } }).then(() =>
    UserMailList.bulkCreate(
      mailLists
        .filter(list => list.subscribed)
        .map(list => ({ user_id: id, mail_list_id: list.mail_list_id })),
    ),
  );
}
