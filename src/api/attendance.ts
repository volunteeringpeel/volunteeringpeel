/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as csvStringify from 'csv-stringify';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';
import * as WebSocket from 'ws';

// API Imports
import * as API from '@api/api';
import * as JwtAPI from '@api/jwt';
import * as Utilities from '@api/utilities';

interface AttendanceWebSocket extends WebSocket {
  isAlive: boolean;
  user: User;
  db: mysql.PoolConnection;
  release: () => void;
}

// send a message to all clients
const broadcast = (msg: WebSocketData<any>) =>
  API.attendanceWss.clients.forEach(client => {
    if (client.readyState === client.OPEN) client.send(JSON.stringify(msg));
  });
// send out list of currently connected clients
const broadcastClients = () => {
  const clientList: string[] = [];
  API.attendanceWss.clients.forEach((client: AttendanceWebSocket) => {
    if (client.readyState === client.OPEN && client.user) {
      clientList.push(`${client.user.first_name} ${client.user.last_name}`);
    }
  });
  broadcast({ action: 'clients', status: 'success', data: clientList });
};
export const webSocket = (ws: AttendanceWebSocket, req: Express.Request) => {
  // Utility functions
  const send = (res: WebSocketData<any>) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(res));
  };
  const die = async (action: string, error: string, details: any) => {
    ws.release();
    send({ action, error, details, status: 'error' });
  };
  const success = async (action: string, data: any) => {
    ws.release();
    send({ action, data, status: 'success' });
  };

  ws.release = () => {
    if (ws.db) {
      if ((API.pool as any).pool._freeConnections.indexOf(ws.db) !== -1) {
        ws.db.release();
      }
    }
  };

  ws.on('message', async (message: string) => {
    // Parse data
    let data: WebSocketRequest<any>;
    try {
      data = JSON.parse(message);
    } catch (e) {
      return die('global', 'Invalid JSON message', e.message);
    }

    // action is in form action[/param]|time
    const action = data.action;
    if (!action) return die(action, 'Invalid JSON request', 'Missing key "action"');
    const actionParts = action.split('|');
    if (actionParts.length !== 2) return die(action, 'Invalid action', 'Cannot parse timestamp');
    const command = actionParts[0].split('/');
    if (process.env.NODE_ENV !== 'production') console.log('WebSocket: ' + action);
    // Parse JWT key
    let err, user;
    [err, user] = await to(Bluebird.resolve(JwtAPI.verify(data.key)));
    if (err) return die(action, 'Cannot parse token', err);
    // Get database connection if not exist
    if (!ws.db) [err, ws.db] = await to(API.pool.getConnection());
    if (err) return die(action, 'Cannot connect to database', err);
    // Get user data
    if (!ws.user) {
      let userInfo;
      [err, userInfo] = await to(
        ws.db.query('SELECT first_name, last_name, role_id, pic FROM user WHERE email = ?', [
          user.email,
        ]),
      );
      console.log(userInfo);
      if (err || !userInfo || !userInfo[0]) return die(action, 'Cannot find user', err);
      ws.user = userInfo[0];
    }
    if (ws.user.role_id < 3) return die(action, 'Unauthorized', 'Token has no admin perms');

    switch (command[0]) {
      case 'shifts': {
        let shifts: any[];
        [err, shifts] = await to(
          ws.db.query(`SELECT
            shift_id, shift_num, name, start_time, event_id
            FROM vw_user_shift
            GROUP BY shift_id
          `),
        );
        if (err) return die(action, 'Error retrieving shift list', err);

        // order by parent event's earliest shift
        return success(
          action,
          _.orderBy(
            shifts,
            [
              shift => {
                const earliestShift = _.minBy(
                  _.filter(shifts, ['event_id', shift.event_id]),
                  'shift_num',
                );
                return earliestShift.start_time;
              },
              'shift_num',
            ],
            ['desc', 'asc'],
          ),
        );
      }
      case 'refresh': {
        // ex. refresh/1|1524957214
        // grab user's first and last name as well as vw_user_shift
        let userShifts: any[]; // update typings at a later date
        [err, userShifts] = await to(
          ws.db.query(
            `SELECT
              us.user_shift_id, us.confirm_level_id,
              us.start_time, us.end_time, us.hours_override,
              us.assigned_exec, us.other_shifts, us.add_info,
              u.user_id, u.first_name, u.last_name,
              u.phone_1, u.phone_2, u.email
            FROM vw_user_shift us
            JOIN user u ON u.user_id = us.user_id
            WHERE us.shift_id = ?`,
            [command[1]],
          ),
        );
        if (err) return die(action, 'Error retreiving attendance', err);

        let confirmLevels: ConfirmLevel[];
        [err, confirmLevels] = await to(
          ws.db.query('SELECT confirm_level_id as id, name, description FROM confirm_level'),
        );
        if (err) return die(action, 'Error retrieving attendance statuses', err);

        let execs: Exec[];
        [err, execs] = await to(ws.db.query('SELECT * FROM user WHERE role_id = 3'));

        return success(action, {
          attendance: _.map(userShifts, userShift => ({
            user_shift_id: +userShift.user_shift_id,
            confirm_level_id: +userShift.confirm_level_id,
            start_time: userShift.start_time,
            end_time: userShift.end_time,
            hours_override: userShift.hours_override,
            other_shifts: userShift.other_shifts,
            assigned_exec: +userShift.assigned_exec,
            add_info: userShift.add_info,
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
      }
      case 'update': {
        // ex. update/1/confirm_level_id|1524957214
        if (command.length < 3) {
          return die(action, 'Not enough parameters', 'Command requires 2 parameters');
        }
        const entryID = +command[1];
        const field = command[2];
        // check if field is allowed (i.e. not a bug/sqli)
        if (
          !_.includes(
            [
              'confirm_level_id',
              'start_override',
              'end_override',
              'hours_override',
              'assigned_exec',
              'add_info',
            ],
            field,
          )
        ) {
          return die(action, 'Invalid field', 'Field is not set as updatable via live API');
        }
        let result;
        [err, result] = await to(
          ws.db.query('UPDATE user_shift SET ? WHERE user_shift_id = ?', [
            { [field]: data.data },
            entryID,
          ]),
        );
        if (err) return die(action, 'Error updating attendance, please try again', err);

        return broadcast({ action, status: 'success', data: data.data });
      }
      case 'users': {
        // ex. users|1524957214
        let users;
        // todo: filter out already signed up users
        [err, users] = await to(ws.db.query('SELECT user_id, first_name, last_name FROM user'));
        if (err) return die(action, 'Cannot find users', err);

        return success(
          action,
          _.map(users, u => ({ text: `${u.first_name} ${u.last_name}`, value: +u.user_id })),
        );
      }
      case 'add': {
        // ex. add/1|1524957214
        [err] = await to(
          ws.db.query('INSERT INTO user_shift SET ?', [
            { user_id: data.data, shift_id: command[1] },
          ]),
        );
        if (err) return die(action, 'Cannot insert record', err);
        return success(action, 'Added record successfully');
      }
      case 'delete': {
        // ex delete/1|1524957214
        [err] = await to(
          ws.db.query('DELETE FROM user_shift WHERE user_id = ? AND shift_id = ?', [
            data.data,
            command[1],
          ]),
        );
        if (err) return die(action, 'Cannot delete record', err);
        return success(action, 'Record deleted successfully');
      }
      default: {
        return die(action, 'Unknown command', '');
      }
    }
  });

  // update all other clients if someone dies
  ws.on('close', () => {
    broadcastClients();
    ws.release();
  });

  // pong handling
  ws.isAlive = true;
  ws.on('pong', () => {
    ws.isAlive = true;
  });

  // send immediatly a feedback to the incoming connection
  console.log('WebSocket connection');
  broadcastClients();
};

// ping to make sure client is still there
setInterval(() => {
  API.attendanceWss.clients.forEach((ws: AttendanceWebSocket) => {
    if (!ws.isAlive) {
      ws.release();
      ws.terminate();
      broadcastClients();
      return;
    }

    ws.isAlive = false;
    ws.ping(null, false);
  });
}, 1000);

export const exportToCSV: Express.RequestHandler = async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, data;
  [err, data] = await to(
    req.db.query(
      `SELECT 
        first_name, last_name, phone_1, phone_2, add_info
        FROM user_shift us
        JOIN user u ON u.user_id = us.user_id
        WHERE us.shift_id = ?`,
      [req.params.id],
    ),
  );
  if (err) return res.error(500, 'Error selecting attendance data', err);

  let rows = [['First', 'Last', 'Phone #1', 'Phone #2', 'Notes']];
  rows = rows.concat(
    _.map(data, row => [row.first_name, row.last_name, row.phone_1, row.phone_2, row.notes]),
  );

  let csv;
  [err, csv] = await to(Bluebird.promisify(csvStringify)(rows));
  if (err) return res.error(500, 'Error parsing data', err);

  res.setHeader('Content-disposition', 'attachment; filename=attendance.csv');
  res.set('Content-Type', 'text/csv');
  res.status(200).send(csv);
  req.db.release();
};
