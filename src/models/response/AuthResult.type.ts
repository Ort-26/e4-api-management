import { AuthenticatedUser } from "../dto/Auth.type";


export interface AuthResult {
  accessToken: string;
  refreshToken: string;
  user: AuthenticatedUser;
}
