/* tslint:disable:no-console no-var-requires */
import * as Express from 'express';
import * as session from 'express-session';

// Initialize API
const api = Express.Router();

// Success/error functions
api.use((req, res, next) => {
  res.error = (error, details) => {
    res.status(500).json({ error, details: details || 'No further information', status: 'error' });
  };
  res.success = data => {
    if (data) res.status(200).json({ data, status: 'success' });
    else res.status(200).json({ status: 'success' });
  };
  next();
});

api.get('/user', (req, res) => {
  if (req.session.userData) {
    res.success(req.session.userData);
  } else {
    res.error('Not logged in');
  }
});

api.get('/user/login', (req, res) => {
  req.session.regenerate(error => {
    if (error) res.error(error);
  });

  req.session.userData = { first_name: 'James', last_name: 'Ah Yong' };
  res.success();
});

api.get('*', (req, res) => {
  res.error('Unknown endpoint');
});

export default api;
