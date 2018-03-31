/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// API Imports
import * as API from '@api/api';

export const eventQuery = (authorized: boolean) => async (
  req: Express.Request,
  res: Express.Response,
) => {
  // Grab all events
  let err, events;
  [err, events] = await to(
    req.db.query('SELECT event_id, name, address, transport, description, active FROM event'),
  );
  if (err) return res.error(500, 'Error retrieving event data', err);

  // Get shifts for each event
  const withShifts = await Promise.all(
    _.map(events, async (event: VPEvent) => {
      // If logged in, also check if user is already signed up
      const query = authorized
        ? // Query if logged in
          `SELECT
          s.shift_id, s.shift_num,
          s.start_time, s.end_time, s.hours,
          s.meals, s.max_spots, s.spots_taken, s.notes,
          (CASE WHEN us.user_id IS NULL THEN 0 ELSE 1 END) AS signed_up
        FROM vw_shift s
        JOIN user u
        LEFT JOIN user_shift us ON us.shift_id = s.shift_id AND us.user_id = u.user_id
        WHERE s.event_id = ? AND u.email = ?`
        : // Query if not logged in
          `SELECT
          s.shift_id, s.shift_num,
          s.start_time, s.end_time, s.hours,
          s.meals, s.max_spots, s.spots_taken, s.notes,
          0 signed_up
        FROM vw_shift s
        WHERE s.event_id = ? AND ?`;
      const userID = authorized ? req.user.email : -1; // Use -1 if logged out, as -1 will not match any users

      let shifts;
      [err, shifts] = await to(req.db.query(query, [event.event_id, userID]));
      if (err) return res.error(500, 'Error retrieving shift data', err);

      return {
        ...event,
        active: !!event.active, // Convert to boolean
        shifts: shifts.map((shift: any) => ({
          ...shift,
          meals: shift.meals.split(','),
          signed_up: !!shift.signed_up, // Convert to boolean
        })),
      };
    }),
  );

  res.success(withShifts, 200);
};

export async function editEvent(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  const { name, description, transport, address, active, shifts, deleteShifts } = req.body;
  let err,
    eventID = +req.params.id;

  // Cast parameter to number, because numbers are a good
  if (eventID === -1) {
    // Add new event
    [err, { insertId: eventID }] = await to(
      req.db.query('INSERT INTO event SET ?', {
        name,
        description,
        transport,
        address,
        active,
      }),
    );
    if (err) return res.error(500, 'Error creating new event', err);
  } else {
    // Update event
    [err] = await to(
      req.db.query('UPDATE event SET ? WHERE event_id = ?', [
        { name, description, transport, address, active },
        req.params.id,
      ]),
    );
    if (err) return res.error(500, 'Error updating event data', err);

    // Delete each shift marked for deletion
    _.forEach(deleteShifts as number[], async id => {
      [err] = await to(req.db.query('DELETE FROM shift WHERE shift_id = ?', id));
      if (err) return res.error(500, 'Error deleting shift', err);
    });
  }

  // Create/update shifts (delete is above)
  _.forEach(shifts as Shift[], async shift => {
    const values = {
      event_id: eventID,
      shift_num: shift.shift_num,
      max_spots: shift.max_spots,
      start_time: shift.start_time,
      end_time: shift.end_time,
      meals: shift.meals.join(),
      notes: shift.notes,
    };
    if (shift.shift_id === -1) {
      // Create new shift
      [err] = await to(req.db.query('INSERT INTO shift SET ?', values));
      if (err) return res.error(500, 'Error creating shift', err);
    } else {
      // Update shift
      let changedRows;
      [err, { changedRows }] = await to(
        req.db.query('UPDATE shift SET ? WHERE shift_id = ?', [values, shift.shift_id]),
      );
      if (err || changedRows !== 1) return res.error(500, 'Error updating shift', err);
    }
  });

  res.success(
    `Event ${eventID === -1 ? 'added' : 'updated'} successfully`,
    eventID === -1 ? 201 : 200,
  );
}

export async function deleteEvent(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, affectedRows;
  [err, { affectedRows }] = await to(
    req.db.query('DELETE FROM event WHERE event_id = ?', [req.params.id]),
  );
  if (err || affectedRows !== 1) return res.error(500, 'Error deleting to database', err);
  res.success('Event deleted successfully', 202);
}
