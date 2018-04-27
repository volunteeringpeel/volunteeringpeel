/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// API Imports
import * as API from '@api/api';

export const getAttendance = API.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  // grab user's first and last name as well as vw_user_shift
  let err, userShifts: any[]; // update typings at a later date
  [err, userShifts] = await to(
    req.db.query(`
        SELECT us.*, u.first_name, u.last_name,
        u.phone_1, u.phone_2, u.email
        FROM vw_user_shift us
        JOIN user u ON u.user_id = us.user_id
      `),
  );
  if (err) return res.error(500, 'Error retreiving attendance', err);

  let confirmLevels: ConfirmLevel[];
  [err, confirmLevels] = await to(
    req.db.query('SELECT confirm_level_id as id, name, description FROM confirm_level'),
  );
  if (err) return res.error(500, 'Error retrieving attendance statuses', err);

  let execs: Exec[];
  [err, execs] = await to(req.db.query('SELECT * FROM user WHERE role_id = 3'));

  res.success({
    attendance: _.map(userShifts, userShift => ({
      user_shift_id: +userShift.user_shift_id,
      confirm_level_id: +userShift.confirm_level_id,
      start_time: userShift.start_time,
      end_time: userShift.end_time,
      hours_override: userShift.hours_override,
      other_shifts: userShift.other_shifts,
      assigned_exec: +userShift.assigned_exec,
      shift: {
        shift_id: +userShift.shift_id,
        shift_num: +userShift.shift_num,
      },
      parentEvent: {
        event_id: +userShift.event_id,
        name: userShift.name,
      },
      user: {
        user_id: +userShift.user_id,
        first_name: userShift.first_name,
        last_name: userShift.last_name,
        phone_1: userShift.phone_1,
        phone_2: userShift.phone_2,
        email: userShift.email,
      },
    })),
    levels: confirmLevels,
    execList: _.map(execs, exec => ({
      key: exec.user_id,
      value: exec.user_id,
      text: `${exec.first_name} ${exec.last_name}`,
    })),
  });
});

export const updateAttendance = API.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err;

  // update an attendance entry for each one
  _.forEach(req.body, async userShift => {
    let affectedRows;
    [err, { affectedRows }] = await to(
      req.db.query('UPDATE user_shift SET ? WHERE user_shift_id = ?', [
        {
          confirm_level_id: userShift.confirm_level_id,
          start_override: userShift.start_override,
          end_override: userShift.end_override,
          hours_override: userShift.hours_override,
          assigned_exec: userShift.assigned_exec,
        },
        userShift.user_shift_id,
      ]),
    );
    if (err || affectedRows !== 1) res.error(500, 'Error updating attendance entries');
  });

  res.success(`Attendance updated successfully`, 200);
});
