/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// API Imports
import * as API from '@api/api';

export async function getAttendance(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

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

  let confirmLevels: ConfirmLevel[];
  [err, confirmLevels] = await to(
    req.db.query('SELECT confirm_level_id as id, name, description FROM confirm_level'),
  );
  if (err) return res.error(500, 'Error retrieving attendance statuses', err);

  res.success({
    attendance: _.map(userShifts, userShift => ({
      user_shift_id: +userShift.user_shift_id,
      confirm_level_id: +userShift.confirm_level_id,
      start_time: userShift.start_time,
      end_time: userShift.end_time,
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
      },
    })),
    levels: confirmLevels,
  });
}

export async function updateAttendance(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err;

  // update an attendance entry for each one
  _.forEach(req.body, async userShift => {
    let affectedRows;
    [err, { affectedRows }] = await to(
      req.db.query('UPDATE user_shift SET confirm_level_id = ? WHERE user_shift_id = ?', [
        userShift.confirm_level_id,
        userShift.user_shift_id,
      ]),
    );
    if (err || affectedRows !== 1) res.error(500, 'Error updating attendance entries');
  });

  res.success(`Attendance updated successfully`, 200);
}
