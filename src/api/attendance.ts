/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as csvStringify from 'csv-stringify';
import * as Express from 'express';
import * as _ from 'lodash';
import * as WebSocket from 'ws';

// API Imports
import * as API from '@api/api';
import * as JwtAPI from '@api/jwt';
import * as Utilities from '@api/utilities';

import { ConfirmLevel } from '@api/models/ConfirmLevel';
import { Event } from '@api/models/Event';
import { Role } from '@api/models/Role';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';
import { UserShift } from '@api/models/UserShift';

interface AttendanceWebSocket extends WebSocket {
  isAlive: boolean;
  user: User;
}

// send a message to all clients
const broadcast = (msg: VP.WebSocketData<any>) =>
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
  const send = (res: VP.WebSocketData<any>) => {
    if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(res));
  };
  const die = async (action: string, error: string, details: any) => {
    send({ action, error, details, status: 'error' });
    console.error(error, details);
  };
  const success = async (action: string, data: any) => {
    send({ action, data, status: 'success' });
  };

  ws.on('message', async (message: string) => {
    // Parse data
    let data: VP.WebSocketRequest<any>;
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
    // Get user data
    if (!ws.user) {
      [err, ws.user] = await to(
        User.findOne({
          where: { email: user.email },
          attributes: ['first_name', 'last_name', 'pic'],
          include: [{ model: Role, attributes: ['role_id'] }],
        }),
      );
      if (err || !ws.user) return die(action, 'Cannot find user', err);
    }
    if (ws.user.role.role_id < 3) return die(action, 'Unauthorized', 'Token has no admin perms');

    switch (command[0]) {
      case 'shifts': {
        let events;
        [err, events] = await to(
          Event.findAll({
            attributes: ['event_id', 'name'],
            include: [{ model: Shift, attributes: ['shift_id', 'shift_num', 'start_time'] }],
            order: [[{ model: Shift, as: 'shifts' }, 'shift_num']], // ensure shifts are in order
          }),
        );
        if (err) return die(action, 'Error retrieving event/shift list', err);

        // order events by earliest shift
        events = _.orderBy(events, 'shifts[0].start_time', ['desc']);

        return success(
          action,
          _.flatten(
            // copy event_id and event name into the shift values
            _.map(events, e =>
              e.shifts.map(s => ({ ...s.dataValues, event_id: e.event_id, name: e.name })),
            ),
          ),
        );
      }
      case 'refresh': {
        // ex. refresh/1|1524957214
        // grab user's first and last name as well as vw_user_shift
        let shift: Shift;
        [err, shift] = await to(
          Shift.findByPrimary(command[1], {
            attributes: ['start_time', 'end_time'],
            include: [
              {
                model: User,
                attributes: ['user_id', 'first_name', 'last_name', 'phone_1', 'phone_2', 'email'],
                through: {
                  attributes: [
                    'user_shift_id',
                    'start_override',
                    'end_override',
                    'hours_override',
                    'assigned_exec',
                    // 'other_shifts', find a way to do this
                    'add_info',
                    'confirm_level_id',
                  ],
                },
              },
            ],
          }),
        );
        if (err) return die(action, 'Error retreiving attendance', err);

        let confirmLevels;
        [err, confirmLevels] = await to(
          ConfirmLevel.findAll({
            attributes: [['confirm_level_id', 'id'], 'name', 'description'],
            raw: true,
          }),
        );
        if (err) return die(action, 'Error retrieving attendance statuses', err);

        let execs;
        [err, execs] = await to(
          User.findAll({
            include: [{ model: Role, where: { role_id: Utilities.ROLE_EXECUTIVE } }],
          }),
        );
        if (err) return die(action, 'Error retrieving exec list', err);

        return success(action, {
          // weird typings necessary because of include.attributes
          attendance: _.map(shift.users, (u: User & { user_shift: UserShift }) => ({
            user_shift_id: u.user_shift.user_shift_id,
            confirm_level_id: u.user_shift.confirm_level_id,
            start_time: u.user_shift.start_override || shift.start_time,
            end_time: u.user_shift.end_override || shift.end_time,
            hours_override: u.user_shift.hours_override,
            // other_shifts: u.user_shift.other_shifts,
            assigned_exec: u.user_shift.assigned_exec,
            add_info: u.user_shift.add_info,
            user: {
              user_id: u.user_id,
              first_name: u.first_name,
              last_name: u.last_name,
              phone_1: u.phone_1,
              phone_2: u.phone_2,
              email: u.email,
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
              'hours_override',
              'assigned_exec',
              'add_info',
              // convert to override form later
              'start_time',
              'end_time',
            ],
            field,
          )
        ) {
          return die(action, 'Invalid field', 'Field is not set as updatable via live API');
        }
        // check if this is a datetime field
        const dateTime = field.includes('time');
        const column = dateTime ? field.replace('time', 'override') : field;
        const value = dateTime
          ? new Date(data.data)
              .toISOString()
              .slice(0, 19)
              .replace('T', ' ')
          : data.data;

        [err] = await to(
          UserShift.update({ [column]: value }, { where: { user_shift_id: entryID } }),
        );
        if (err) return die(action, 'Error updating attendance, please try again', err);

        return broadcast({ action, status: 'success', data: data.data });
      }
      case 'users': {
        // ex. users|1524957214
        let users;
        // todo: filter out already signed up users
        [err, users] = await to(
          User.findAll({ attributes: ['user_id', 'email', 'first_name', 'last_name'] }),
        );
        if (err) return die(action, 'Cannot find users', err);

        return success(
          action,
          _.map(users, u => {
            // round 1 of formatting: if any one part of the name is null, omit
            let text = `${u.first_name || ''} ${u.last_name || ''} (${u.email})`;
            // round 2: if both parts of name are null, omit + remove brackets around email
            if (!u.first_name && !u.last_name) text = u.email;
            return { text, value: +u.user_id };
          }),
        );
      }
      case 'add': {
        // ex. add/1|1524957214
        [err] = await to(UserShift.create({ user_id: data.data, shift_id: command[1] }));
        if (err) return die(action, 'Cannot insert record', err);
        return success(action, 'Added record successfully');
      }
      case 'delete': {
        // ex delete/1|1524957214
        [err] = await to(
          UserShift.destroy({
            where: {
              user_id: data.data,
              shift_id: command[1],
            },
          }),
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

  let err, shift: Shift;
  [err, shift] = await to(
    Shift.findByPrimary(req.params.id, {
      attributes: [],
      include: [
        {
          model: User,
          attributes: ['first_name', 'last_name', 'school', 'phone_1', 'add_info'],
          through: { attributes: ['add_info'] },
        },
      ],
    }),
  );
  if (err) return res.error(500, 'Error selecting attendance data', err);

  let rows = [['First', 'Last', 'school', 'Phone #1', 'Phone #2', 'Notes']];
  rows = rows.concat(
    _.map(shift.users, row => [
      row.first_name,
      row.last_name,
      row.school,
      row.phone_1,
      row.phone_2,
      // row.add_info,
    ]),
  );

  res.setHeader('Content-disposition', 'attachment; filename=attendance.csv');
  res.set('Content-Type', 'text/csv');
  csvStringify(rows).pipe(res);
};
