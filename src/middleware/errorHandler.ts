import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { ApiResponse } from '../models/envelope/api-response.type';

export interface AppError extends Error {
  statusCode?: number;
  errorCode?: string;
  transactionId?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.statusCode ?? 500;
  const errorCode = err.errorCode ?? `APP-${statusCode}`;
  const transactionId = err.transactionId ?? randomUUID();
  const safeMessage = 'An unexpected error occurred. Please contact support.';

  res.locals.errorMessage = `${errorCode}: ${safeMessage}`;

  console.error('[error]', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    errorCode,
    message: err.message,
    stack: err.stack,
    transactionId: transactionId,
  });

  const response: ApiResponse<null> = {
    meta: {
      transactionId: transactionId,
      timestamp: new Date().toISOString(),
      message: safeMessage,
      errorType: errorCode,
    },
    data: null,
  };

  res.status(statusCode).json(response);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  const transactionId = randomUUID();
  const response: ApiResponse<null> = {
    meta: {
      transactionId: transactionId,
      timestamp: new Date().toISOString(),
      message: 'Resource not found.',
      errorType: 'APP-404',
    },
    data: null,
  };

  res.status(404).json(response);
};
