import { LoginRequest } from '../../models/request/LoginRequest.type';
import { AuthResult } from '../../models/response/AuthResult.type';

export interface IAuthService {
  login(payload: LoginRequest): Promise<AuthResult>;
  refresh(refreshToken: string): Promise<AuthResult>;
  logout(refreshToken: string): Promise<void>;
}
