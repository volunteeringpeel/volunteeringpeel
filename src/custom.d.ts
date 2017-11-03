// tslint:disable:no-namespace
// Extend Express definitions
declare namespace Express {
  interface Response {
    error(status: number, error: string, details?: any): void;
    success(success?: any): void;
  }

  interface SessionData {
    userData: User;
  }
}
