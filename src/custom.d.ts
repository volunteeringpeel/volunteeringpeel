// tslint:disable:no-namespace
// Extend Express definitions
import * as Bluebird from 'bluebird';
import * as ws from 'ws';

declare global {
  namespace Express {
    interface Response {
      error(status: number, error: string, details?: any): void;
      success(success?: any, status?: number): void;
    }

    interface SessionData {
      userData: VolunteeringPeel.User;
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
interface JWT {
  header: {
    typ: 'JWT';
    alg: string;
    kid?: string;
  };
  payload: JWTPayload;
}
interface JWTPayload {
  iss?: string;
  sub?: string;
  aud?: string[];
  exp?: number;
  nbf?: number;
  iat?: number;
  email: string;
  [x: string]: any;
}
declare module 'jsonwebtoken' {
  function decode(token: string, options?: DecodeOptions): JWT;
  function verify(
    token: string,
    secretOrPublicKey?: string | Buffer,
    options?: VerifyOptions,
    callback?: VerifyCallback,
  ): JWTPayload;
}
