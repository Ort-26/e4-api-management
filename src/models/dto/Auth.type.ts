import { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload, AuthPayload {
  sub: string;
  tokenType: 'access' | 'refresh';
}

export interface AuthPayload extends AuthenticatedUser {
    permissions: number[];
}

export interface AuthenticatedUser {
  userId: number;
  userName: string;
  userLastname: string;
  email: string;
  roleId: number;
}
 
export interface AuthUserRecord extends AuthenticatedUser {
  hashPassword: string;
}