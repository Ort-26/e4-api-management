import { CatRole } from "../domain/cat-role.type";

export interface UserDto {
  userId: number;
  username: string;
  userLastName: string;
  email: string;
  role: CatRole;
}