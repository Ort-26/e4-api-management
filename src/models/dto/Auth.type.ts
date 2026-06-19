import { JwtPayload } from "jsonwebtoken";

export interface AuthTokenPayload extends JwtPayload {
  sub: string;
  userId: number;
  email: string;
  roleId: number;
  tokenType: 'access' | 'refresh';
}


export interface AuthPayload { 
    sub: string;
    userId: number;
    email: string;
    roleId: number;
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