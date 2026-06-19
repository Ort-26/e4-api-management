import { NextFunction, Request, Response, CookieOptions } from 'express';
import { randomUUID } from 'crypto';
import { config } from '../config';
import { LoginRequest } from '../models/request/LoginRequest.type';
import { AppError } from '../middleware/errorHandler';
import { IAuthService } from '../services/interfaces/IAuthService';
import { successResponse } from '../utils/metadataHelper';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const payload = req.body as LoginRequest;

      if (!payload?.email || typeof payload.email !== 'string') 
        return next(this.buildError(400, 'APP-AUTH-400', 'Email is required', res));
      
      const authResult = await this.authService.login(payload);
      this.setTokenCookies(res, authResult.accessToken, authResult.refreshToken);

      res.status(200).json(
        successResponse({
          user: authResult.user,
          accessToken: authResult.accessToken,
        }),
      );
    } catch (error) {
      next(this.mapAuthError(error, res));
    }
  };

  refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[config.auth.refreshTokenCookieName] as | string | undefined;

      if (!refreshToken) 
        return next(this.buildError(401, 'APP-AUTH-401', 'Refresh token not found', res));
      

      const authResult = await this.authService.refresh(refreshToken);
      this.setTokenCookies(res, authResult.accessToken, authResult.refreshToken);

      res.status(200).json(
        successResponse({
          user: authResult.user,
          accessToken: authResult.accessToken,
        }),
      );
    } catch (error) {
      next(this.mapAuthError(error, res));
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies?.[config.auth.refreshTokenCookieName] as | string | undefined;

      if (!refreshToken) {
        return next(this.buildError(401, 'APP-AUTH-401', 'Refresh token not found', res));
      }

      await this.authService.logout(refreshToken);
      this.clearTokenCookies(res);

      res.status(200).json(successResponse({ loggedOut: true }));
    } catch (error) {
      next(this.mapAuthError(error, res));
    }
  };

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.auth.cookieSecure,
      sameSite: config.auth.cookieSameSite,
      domain: config.auth.cookieDomain,
      path: '/',
    };

    res.cookie(config.auth.accessTokenCookieName, accessToken, cookieOptions);
    res.cookie(config.auth.refreshTokenCookieName, refreshToken, cookieOptions);
  }

  private clearTokenCookies(res: Response): void {
    const cookieOptions: CookieOptions = {
      httpOnly: true,
      secure: config.auth.cookieSecure,
      sameSite: config.auth.cookieSameSite,
      domain: config.auth.cookieDomain,
      path: '/',
    };

    res.clearCookie(config.auth.accessTokenCookieName, cookieOptions);
    res.clearCookie(config.auth.refreshTokenCookieName, cookieOptions);
  }

  private mapAuthError(error: unknown, res: Response): AppError {
    if (error instanceof Error && error.message === 'AUTH_INVALID_CREDENTIALS') {
      return this.buildError(401, 'APP-AUTH-401', 'Invalid credentials', res);
    }

    if (error instanceof Error && error.message === 'AUTH_INVALID_TOKEN') {
      return this.buildError(401, 'APP-AUTH-401', 'Invalid token', res);
    }

    const appError = this.buildError(500, 'APP-AUTH-500', 'Authentication failed', res);
    appError.stack = error instanceof Error ? error.stack : undefined;
    return appError;
  }

  private buildError(
    statusCode: number,
    errorCode: string,
    message: string,
    res: Response,
  ): AppError {
    const appError = new Error(message) as AppError;
    appError.statusCode = statusCode;
    appError.errorCode = errorCode;
    appError.transactionId = res.locals.transactionId || randomUUID();
    return appError;
  }
}
