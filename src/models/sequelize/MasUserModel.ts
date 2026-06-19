import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { MasUser } from '../domain/mas-user.type';

type MasUserCreationAttributes = Optional<MasUser, 'userId'>;

export class MasUserModel
  extends Model<MasUser, MasUserCreationAttributes>
  implements MasUser
{
  declare userId: number;
  declare userName: string;
  declare userLastname: string;
  declare email: string;
  declare hashPassword: string;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare roleId: number;
}

MasUserModel.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'user_id',
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_name',
    },
    userLastname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'user_lastname',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'email',
    },
    hashPassword: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'hash_password',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at',
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'role_id',
    },
  },
  {
    sequelize,
    modelName: 'MasUser',
    tableName: 'mas_users',
    timestamps: false,
  },
);