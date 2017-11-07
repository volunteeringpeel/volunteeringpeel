// tslint:disable:no-namespace
// Extend Express definitions
import mysql = require('promise-mysql');

declare global {
  namespace Express {
    interface Response {
      error(status: number, error: string, details?: any): void;
      success(success?: any): void;
    }

    interface Request {
      pool: mysql.Pool;
    }

    interface SessionData {
      userData: User;
    }
  }
}
