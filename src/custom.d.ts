// tslint:disable:no-namespace
// Extend Express definitions
import promiseMysql = require('promise-mysql');

declare global {
  namespace Express {
    interface Response {
      error(status: number, error: string, details?: any, db?: promiseMysql.PoolConnection): void;
      success(success?: any, status?: number, db?: promiseMysql.PoolConnection): void;
    }

    interface Request {
      pool: promiseMysql.Pool;
    }

    interface SessionData {
      userData: User;
    }
  }
}
