/* tslint:disable:no-console no-var-requires import-name */
import to from '@lib/await-to-js';
import * as Bluebird from 'bluebird';
import * as Express from 'express';
import * as _ from 'lodash';
import * as mysql from 'promise-mysql';

// Import API core
import * as API from '@api/api';

export async function getMailingList(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err, db);

  let results;
  [err, results] = await to(
    db.query(
      `SELECT
        mail_list_id, display_name, description,
        first_name, last_name, email
      FROM vw_user_mail_list`,
    ),
  );

  // group results by display_name
  const grouped = _.groupBy(results, 'mail_list_id');

  // restructure data
  const lists = _.map(grouped, (list: any) => ({
    mail_list_id: list[0].mail_list_id,
    display_name: list[0].display_name,
    description: list[0].description,
    members: _.map(list, (item: any) => ({
      first_name: item.first_name,
      last_name: item.last_name,
      email: item.email,
    })),
  }));

  res.success(lists, 200, db);
}

export async function deleteMailingList(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err, db);

  [err] = await to(db.query('DELETE FROM mail_list WHERE mail_list_id = ?', +req.params.id));
  if (err) return res.error(500, 'Error deleting mail list', err, db);
  res.success('Mail list deleted successfully', 200, db);
}

export async function updateMailingList(req: Express.Request, res: Express.Response) {
  if (req.user.role_id < API.ROLE_EXECUTIVE) res.error(403, 'Unauthorized');

  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err, db);

  const { display_name, description } = req.body;

  // insert new mail list
  if (+req.params.id === -1) {
    [err] = await to(db.query('INSERT INTO mail_list SET ?', { display_name, description }));
    if (err) return res.error(500, 'Error creating mail list', err, db);
    return res.success('Mail list created successfully', 201, db);
  }

  // update existing mail list
  [err] = await to(
    db.query('UPDATE mail_list SET ? WHERE ?', [
      { display_name, description },
      { mail_list_id: +req.params.id },
    ]),
  );
  if (err) return res.error(500, 'Error creating mail list', err, db);
  res.success('Mail list updated successfully', 200, db);
}

export async function signup(req: Express.Request, res: Express.Response) {
  let err, db: mysql.PoolConnection;

  [err, db] = await to(req.pool.getConnection());
  if (err) return res.error(500, 'Error connecting to database', err, db);

  let userID: number;
  [err, { insertId: userID }] = await to(
    db.query(
      'INSERT INTO user (email) VALUES (?) ON DUPLICATE KEY UPDATE user_id = LAST_INSERT_ID(user_id)',
      req.body.email,
    ),
  );
  if (err) return res.error(500, 'Error creating email record', err, db);

  let result;
  [err, result] = await to(
    db.query('INSERT INTO user_mail_list SET ?', {
      user_id: userID,
      mail_list_id: req.params.id,
    }),
  );
  if (err) return res.error(500, 'Error subscribing email', err, db);

  if (result.affectedRows === 1) {
    res.success(`${req.body.email} added to mailing list!`, 201, db);
  } else {
    res.error(500, 'This should not happen.', null, db);
  }
}
