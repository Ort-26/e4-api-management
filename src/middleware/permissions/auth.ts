import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import { AppError } from '../errorHandler';
import { AuthTokenPayload } from '../../models/dto/Auth.type';

const extractBearerToken = (authorizationHeader?: string): string | null => {
  if (!authorizationHeader) return null;
  const [scheme, token] = authorizationHeader.split(' ');
  if (!scheme || !token || scheme.toLowerCase() !== 'bearer') return null;  
  return token;
};

const buildUnauthorizedError = (res: Response, message: string): AppError => {
  const appError = new Error(message) as AppError;
  appError.statusCode = 401;
  appError.errorCode = 'APP-AUTH-401';
  appError.message = message;
  appError.transactionId = res.locals.transactionId || randomUUID();
  return appError;
};

export const requireAccessToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const bearerToken = extractBearerToken(req.header('authorization'));
    const cookieToken = req.cookies?.[config.auth.accessTokenCookieName] as | string | undefined;
    const token = bearerToken ?? cookieToken;
    if (!token) return next(buildUnauthorizedError(res, 'Access token not found'));
    const decoded = jwt.verify(token, config.auth.accessTokenSecret);
    if (typeof decoded === 'string') return next(buildUnauthorizedError(res, 'Invalid token'));
    const tokenPayload = validateTokenPayload(decoded as AuthTokenPayload);
    if (!tokenPayload) return next(buildUnauthorizedError(res, 'Invalid token payload'));
    if (tokenPayload.tokenType !== 'access') return next(buildUnauthorizedError(res, 'Invalid token type'));
    const userId = Number(tokenPayload.sub);
    res.locals.authUserId = userId;
    res.locals.authProfile = tokenPayload;
    return next();
  } catch {
    return next(buildUnauthorizedError(res, 'Invalid token'));
  }
};


const validateTokenPayload = (payload: AuthTokenPayload): AuthTokenPayload | null => {

  if (!payload || !payload.userId || !payload.userName || !payload.userLastname || !payload.email || !payload.roleId) {
    return null;
  }

  const userId = Number(payload.sub);
  if (!Number.isInteger(userId) || userId <= 0) {
    return null;
  }

  return {
    userId: payload.userId,
    userName: payload.userName,
    userLastname: payload.userLastname,
    email: payload.email,
    roleId: payload.roleId,
    sub: payload.sub,
    tokenType: payload.tokenType,
    permissions: payload.permissions,
  };
}