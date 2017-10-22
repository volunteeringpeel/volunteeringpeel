/* tslint:disable:no-console no-var-requires */
import * as Express from 'express';
import * as session from 'express-session';

const api = Express.Router();

api.get('/user', (req, res) => {
  if (req.session.userData) {
    res.json({ status: 'success', user: req.session.userData });
  } else {
    res.json({ status: 'error', error: 'Not logged in' });
  }
});

api.get('/user/login', (req, res) => {
  req.session.regenerate(error => {
    if (error) {
      res.json({ error, status: 'error' });
    }
  });

  req.session.userData = { first_name: 'James', last_name: 'Ah Yong' };
  res.json({ status: 'success' });
});

api.get('*', (req, res) => {
  res.json({ status: 'error', error: 'Unknown endpoint' });
});

export default api;
