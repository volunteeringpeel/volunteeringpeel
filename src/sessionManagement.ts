/* tslint:disable:no-console no-var-requires */
import * as Express from 'express';
import * as session from 'express-session';

export default (app: Express.Application) => {
  const passwordsJson = require('./passwords.json');

  // Setup Express sessions
  const sessionConfig: session.SessionOptions = {
    secret: passwordsJson.session.secret,
    saveUninitialized: true,
    resave: false,
    name: 'vp',
    cookie: {
      path: '/',
      httpOnly: true,
      maxAge: 1800000,
    },
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
  }

  app.use(session(sessionConfig));
};
