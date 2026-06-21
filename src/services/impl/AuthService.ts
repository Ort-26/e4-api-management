import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../../config';
import { LoginRequest } from '../../models/request/LoginRequest.type';
import { AuthResult } from '../../models/response/AuthResult.type';
import { IAuthRepository } from '../../repositories/interfaces/IAuthRepository';
import { IAuthService } from '../interfaces/IAuthService';
import { AuthTokenPayload, AuthUserRecord } from '../../models/dto/Auth.type';
import { IRolesRepository } from '../../repositories/interfaces/IRolesRepository';
import { CatPermission } from '../../models/domain/cat-permission.type';


export class AuthService implements IAuthService {
  private readonly authRepository: IAuthRepository;
  private readonly rolesRepository: IRolesRepository;

  constructor(authRepository: IAuthRepository, rolesRepository: IRolesRepository) {
    this.authRepository = authRepository;
    this.rolesRepository = rolesRepository;
  }

  async login(payload: LoginRequest): Promise<AuthResult> {
    const user = await this.authRepository.findUserByEmail(payload.email);
    if (!user) throw new Error('AUTH_INVALID_CREDENTIALS');
    await this.validatePassword(user, payload.password);
    const permissions: CatPermission[] = await this.rolesRepository.getPermissionsByRoleId(user.roleId);
    const permissionIds = permissions.map((permission) => permission.permissionId);
    return this.buildAuthResult(user, permissionIds);
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
    const permissions: CatPermission[] = await this.rolesRepository.getPermissionsByRoleId(tokenPayload.roleId);
    const permissionIds = permissions.map((permission) => permission.permissionId);
    return this.buildAuthResult(user, permissionIds);
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

  private buildAuthResult(user: AuthUserRecord, permissions: number[]): AuthResult {
    const basePayload: AuthTokenPayload = {
      sub: String(user.userId),
      userId: user.userId,
      userName: user.userName,
      userLastname: user.userLastname,
      email: user.email,
      roleId: user.roleId,
      permissions: permissions,
      tokenType: 'access'
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
        permissions: permissions,
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
