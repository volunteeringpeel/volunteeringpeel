/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as fs from 'fs-extra';
import * as _ from 'lodash';

// API Imports
import db from '@api/db';
import * as Utilities from '@api/utilities';

import { Event } from '@api/models/Event';
import { Shift } from '@api/models/Shift';
import { User } from '@api/models/User';

const Op = db.Sequelize.Op;

export const eventQuery = (authorized: boolean) =>
  Utilities.asyncMiddleware(async (req: Express.Request, res: Express.Response) => {
    // Grab all events
    let err, events;
    // If logged in, grab admin data (active)
    const query = authorized ? {} : { active: true };
    [err, events] = await to(
      Event.findAll({
        where: query,
        attributes: [
          'event_id',
          'name',
          'address',
          'transport',
          'description',
          'active',
          'add_info',
        ],
      }),
    );
    if (err) return res.error(500, 'Error retrieving event data', err);

    // Get shifts for each event
    const withShifts = await Promise.all(
      _.map(events, async event => {
        // If logged in, also check if user is already signed up
        const shiftQuery = authorized
          ? // Query if logged in
            {
              include: [
                { model: Event, where: { event_id: event.event_id } },
                // { model: User, where: { email: req.user.email } },
              ],
              attributes: [
                'shift_id',
                'shift_num',
                'start_time',
                'end_time',
                'meals',
                'max_spots',
                'notes',
              ],
            }
          : { include: [{ model: Event, where: { event_id: event.event_id } }] };

        let shifts;
        [err, shifts] = await to(Shift.findAll(shiftQuery));
        if (err) return res.error(500, 'Error retrieving shift data', err);
        shifts = (await Promise.all(
          shifts.map(async shift => {
            let count, signup;
            // Count signed up users to calculate spots_taken
            [err, count] = await to(shift.$count('users'));
            if (err) return res.error(500, 'Error counting availability', err);
            // Check if a record exists to find signed_up
            if (authorized) {
              [err, signup] = await to(
                shift.$get<User>('users', {
                  where: { email: req.user.email },
                  attributes: ['email'],
                }),
              );
              if (err) return res.error(500, 'Error checking signup status', err);
            }
            return {
              ...shift.dataValues,
              meals: shift.meals.split(','),
              spots_taken: count,
              // cast signup to array to fix ambiguous hasOne vs hasMany
              signed_up: authorized ? (signup as User[]).length > 0 : false,
            };
          }),
        )) as VP.Shift[];

        return {
          ...event.dataValues,
          shifts,
        };
      }),
    );

    res.success(withShifts, 200);
  });

export const editEvent = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  const params: any = {};
  for (const param in req.body) params[param] = JSON.parse(req.body[param]);
  let err, event: Event;

  const eventData = {
    name: params.name,
    description: params.description,
    transport: params.transport,
    address: params.address,
    active: params.active,
    add_info: params.add_info,
  };

  // Find or create event
  [err, event] = await to(
    Event.findByPrimary(req.params.id).then(found => {
      if (found !== null) return found;
      return Event.create(eventData);
    }),
  );
  if (err) return res.error(500, 'Error creating new event', err);
  // Update event data
  [err, event] = await to(event.update(eventData));
  if (err) return res.error(500, 'Error updating event data', err);

  // Delete each shift marked for deletion
  [err] = await to(Shift.destroy({ where: { shift_id: { [Op.in]: params.deleteShifts } } }));
  if (err) return res.error(500, 'Error deleting shift', err);

  // Create/update shifts (delete is above)
  await Promise.all(
    _.map(params.shifts as VP.Shift[], async s => {
      const shiftData = {
        event_id: event.event_id,
        shift_num: s.shift_num,
        max_spots: s.max_spots,
        start_time: s.start_time,
        end_time: s.end_time,
        meals: s.meals.join(),
        notes: s.notes,
      };
      // Find or create new shift
      let shift;
      [err, shift] = await to(
        Shift.findByPrimary(s.shift_id).then(found => {
          if (found !== null) return found;
          return Shift.create(shiftData);
        }),
      );
      if (err) return res.error(500, 'Error creating shift', err);
      // Update shift
      [err] = await to(shift.update(shiftData));
      if (err) return res.error(500, 'Error updating shift', err);
    }),
  );

  // Handle uploaded hours letter
  if (req.file) {
    [err] = await to(
      Bluebird.resolve(
        fs.move(req.file.path, `${global.appDir}/upload/letter/${req.file.filename}`),
      ),
    );
    if (err) return res.error(500, 'Failed to save uploaded file', err);
    [err] = await to(event.update({ letter: req.file.filename }));
    if (err) return res.error(500, 'Error handling hours letter upload');
  }

  res.success({ event_id: event.event_id }, event.event_id === -1 ? 201 : 200);
});

export const deleteEvent = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, affectedRows;
  [err, affectedRows] = await to(Event.destroy({ where: { event_id: req.params.id } }));
  if (err || affectedRows !== 1) return res.error(500, 'Error deleting event', err);
  res.success('Event deleted successfully', 202);
});
