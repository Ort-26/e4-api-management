import { AuthUserRecord } from "../../models/dto/Auth.type";

export interface IAuthRepository {
  findUserByEmail(email: string): Promise<AuthUserRecord | null>;
  findUserById(userId: number): Promise<AuthUserRecord | null>;
}
