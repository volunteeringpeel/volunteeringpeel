/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as _ from 'lodash';

// Import API core
import * as Utilities from '@api/utilities';

import { MailList } from '@api/models/MailList';
import { User } from '@api/models/User';

export const getMailingList = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, results;
  [err, results] = await to(
    MailList.findAll({
      attributes: ['mail_list_id', 'display_name', 'description'],
      include: [{ model: User, attributes: ['first_name', 'last_name', 'email'] }],
    }),
  );
  if (err) res.error(500, 'Error loading mail list data');

  // restructure data
  const lists = _.map(results, list => ({
    mail_list_id: list.mail_list_id,
    display_name: list.display_name,
    description: list.description,
    members: _.map(list.users, user => ({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    })),
  }));

  res.success(lists, 200);
});

export const deleteMailingList = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err;
  [err] = await to(MailList.destroy({ where: { mail_list_id: req.params.id } }));
  if (err) return res.error(500, 'Error deleting mail list', err);
  res.success('Mail list deleted successfully', 200);
});

export const updateMailingList = Utilities.asyncMiddleware(async (req, res) => {
  if (req.user.role_id < Utilities.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err;
  const { display_name, description } = req.body;

  // insert new mail list
  if (+req.params.id === -1) {
    [err] = await to(MailList.create({ display_name, description }));
    if (err) return res.error(500, 'Error creating mail list', err);
    return res.success('Mail list created successfully', 201);
  }

  // update existing mail list
  [err] = await to(
    MailList.update({ display_name, description }, { where: { mail_list_id: +req.params.id } }),
  );
  if (err) return res.error(500, 'Error updating mail list', err);
  res.success('Mail list updated successfully', 200);
});

export const signup = Utilities.asyncMiddleware(async (req, res) => {
  let err, results;
  [err, results] = await to(
    User.findOrCreate({ where: { email: req.body.email }, attributes: ['email'] }),
  );
  if (err) return res.error(500, 'Error creating email record', err);

  [err] = await to(results[0].$add('mail_lists', req.params.id));
  if (err) return res.error(500, 'Error subscribing email! You may already be subscribed', err);

  res.success(`${req.body.email} added to mailing list!`, 201);
});
