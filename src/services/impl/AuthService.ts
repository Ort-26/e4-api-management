import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';
import { LoginRequest } from '../../models/request/LoginRequest.type';
import { AuthResult } from '../../models/response/AuthResult.type';
import { IAuthRepository } from '../../repositories/interfaces/IAuthRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthTokenPayload, AuthUserRecord } from '../../models/dto/Auth.type';


export class AuthService implements IAuthService {
  constructor(private readonly authRepository: IAuthRepository) {}

  async login(payload: LoginRequest): Promise<AuthResult> {
    const user = await this.authRepository.findUserByEmail(payload.email);
    if (!user) throw new Error('AUTH_INVALID_CREDENTIALS');
    await this.validatePassword(user, payload.password);
    return this.buildAuthResult(user);
  }

  async refresh(refreshToken: string): Promise<AuthResult> {
    const tokenPayload = this.verifyToken(refreshToken, 'refresh');
    const userId = Number(tokenPayload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new Error('AUTH_INVALID_TOKEN');
    }

    const user = await this.authRepository.findUserById(userId);

    if (!user) {
      throw new Error('AUTH_INVALID_TOKEN');
    }

    return this.buildAuthResult(user);
  }

  async logout(refreshToken: string): Promise<void> {
    this.verifyToken(refreshToken, 'refresh');
  }

  private async validatePassword(user: AuthUserRecord,password?: string): Promise<void> {
    if (!password) {
      throw new Error('AUTH_INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.hashPassword);

    if (!isMatch) {
      throw new Error('AUTH_INVALID_CREDENTIALS');
    }
  }

  private buildAuthResult(user: AuthUserRecord): AuthResult {
    const basePayload: AuthTokenPayload = {
      sub: String(user.userId),
      userId: user.userId,
      userName: user.userName,
      userLastname: user.userLastname,
      email: user.email,
      roleId: user.roleId,
      tokenType: 'access',
    };

    const accessToken = jwt.sign(
      { ...basePayload, tokenType: 'access' } as AuthTokenPayload,
      config.auth.accessTokenSecret,
      { expiresIn: config.auth.accessTokenExpiresIn } as SignOptions,
    );

    const refreshToken = jwt.sign(
      { ...basePayload, tokenType: 'refresh' } as AuthTokenPayload,
      config.auth.refreshTokenSecret,
      { expiresIn: config.auth.refreshTokenExpiresIn } as SignOptions,
    );

    return {
      accessToken,
      refreshToken,
      user: {
        userId: user.userId,
        userName: user.userName,
        userLastname: user.userLastname,
        email: user.email,
        roleId: user.roleId,
      },
    };
  }

  private verifyToken(token: string, expectedType: 'access' | 'refresh'): AuthTokenPayload {
    try {
      const secret = expectedType === 'access'
          ? config.auth.accessTokenSecret
          : config.auth.refreshTokenSecret;

      const decoded = jwt.verify(token, secret);

      if (typeof decoded === 'string') {
        throw new Error('AUTH_INVALID_TOKEN');
      }

      if (decoded.tokenType !== expectedType) {
        throw new Error('AUTH_INVALID_TOKEN');
      }

      return decoded as AuthTokenPayload;
    } catch {
      throw new Error('AUTH_INVALID_TOKEN');
    }
  }
}
