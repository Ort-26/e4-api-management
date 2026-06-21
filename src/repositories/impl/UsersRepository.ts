import { CatRole } from '../../models/domain/cat-role.type';
import { MasUser } from '../../models/domain/mas-user.type';
import { UserDto } from '../../models/dto/UserDto';
import { CatRolesModel } from '../../models/sequelize/CatRolesModel';
import { MasUserModel } from '../../models/sequelize/MasUserModel';
import { IUsersRepository } from '../interfaces/IUsersRepository';

export class UsersRepository implements IUsersRepository {
  constructor() {
    this.configureAssociations();
  }

  private configureAssociations(): void {
    if (!MasUserModel.associations.role) {
      MasUserModel.belongsTo(CatRolesModel, {
        foreignKey: 'roleId',
        targetKey: 'roleId',
        as: 'role',
      });
    }
  }

  async getAllAgents(): Promise<UserDto[]> {
    const records = await MasUserModel.findAll({
      include: [
        {
          model: CatRolesModel,
          as: 'role',
          required: true,
          where: { roleName: 'AGENT' },
        },
      ],
      order: [['userId', 'ASC']],
    });

    return records
      .map((record) => {
        const plain = record.get({ plain: true }) as MasUser & { role?: CatRole };

        if (!plain.role) {
          return null;
        }

        return {
          userId: plain.userId,
          username: plain.userName,
          userLastName: plain.userLastname,
          email: plain.email,
          role: plain.role,
        };
      })
      .filter((user): user is UserDto => Boolean(user));
  }
}
