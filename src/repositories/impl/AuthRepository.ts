import { AuthUserRecord } from '../../models/dto/Auth.type';
import { MasUserModel } from '../../models/sequelize/MasUserModel';
import { IAuthRepository } from '../interfaces/IAuthRepository';

export class AuthRepository implements IAuthRepository {
  async findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const user = await MasUserModel.findOne({
      where: { email },
      attributes: ['userId', 'userName', 'userLastname', 'email', 'roleId', 'hashPassword'],
    });

    return user?.get({ plain: true }) ?? null;
  }

  async findUserById(userId: number): Promise<AuthUserRecord | null> {
    const user = await MasUserModel.findByPk(userId, {
      attributes: ['userId', 'userName', 'userLastname', 'email', 'roleId', 'hashPassword'],
    });

    return user?.get({ plain: true }) ?? null;
  }
}

export const authRepository = new AuthRepository();
