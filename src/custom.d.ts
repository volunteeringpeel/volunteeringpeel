// tslint:disable:no-namespace
// Extend Express definitions
import promiseMysql = require('promise-mysql');

declare global {
  namespace Express {
    interface Response {
      error(status: number, error: string, details?: any): void;
      success(success?: any, status?: number): void;
    }

    interface Request {
      pool: promiseMysql.Pool;
    }

    interface SessionData {
      userData: User;
    }
  }
}
