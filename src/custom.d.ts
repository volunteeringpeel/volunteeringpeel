// tslint:disable:no-namespace
// Extend Express definitions
import * as Bluebird from 'bluebird';
import * as mysql from 'promise-mysql';
import * as ws from 'ws';

declare global {
  namespace Express {
    interface Response {
      error(status: number, error: string, details?: any, db?: mysql.PoolConnection): void;
      success(success?: any, status?: number, db?: mysql.PoolConnection): void;
    }

    interface Request {
      db: mysql.PoolConnection;
    }

    interface SessionData {
      userData: User;
    }
  }

  namespace NodeJS {
    interface Global {
      appDir: string;
    }
  }
}
declare module 'express-ws' {
  interface Instance {
    getWss(path: string): ws.Server;
  }
}
