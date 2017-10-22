// Extend Express definitions
declare namespace Express {
  interface Response {
    error(error: string, details?: any): void;
    success(success?: any): void;
  }

  interface SessionData {
    userData: User;
  }
}
