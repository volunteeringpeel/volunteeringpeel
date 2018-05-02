import * as Express from 'express';

// Roles
export const ROLE_VOLUNTEER = 1;
export const ROLE_ORGANIZER = 2;
export const ROLE_EXECUTIVE = 3;
export const asyncMiddleware: ((fn: Express.RequestHandler) => Express.RequestHandler) = fn => (
  req,
  res,
  next,
) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
