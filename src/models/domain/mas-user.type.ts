export interface MasUser {
  userId: number;
  userName: string;
  userLastname: string;
  email: string;
  hashPassword: string;
  createdAt: Date;
  updatedAt: Date;
  roleId: number;
}
