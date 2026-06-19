import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { randomUUID } from 'crypto';
import { AppError } from './errorHandler';

export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const appError = new Error('Validation failed') as AppError;
  appError.statusCode = 400;
  appError.errorCode = 'APP-400';
  appError.transactionId = res.locals.transactionId || randomUUID();
  appError.stack = JSON.stringify(errors.array(), null, 2);

  return next(appError);
};
