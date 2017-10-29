/* tslint:disable:no-console no-var-requires */
import * as Express from 'express';
import * as session from 'express-session';

const mySQLStore = require('express-mysql-session')(session);

export default (app: Express.Application) => {
  const passwordsJson = require('./passwords.json');

  // Express session store
  const sessionStoreConfig = {
    database: 'volunteeringpeel',
    host: 'localhost',
    user: 'volunteeringpeel',
    password: passwordsJson.mysql.password,
    charset: 'utf8mb4',
  };
  const sessionStore = new mySQLStore(sessionStoreConfig);

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
    store: sessionStore,
  };

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie.secure = true;
  }

  app.use(session(sessionConfig));
};
