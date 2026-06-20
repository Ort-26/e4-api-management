
import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize'; 
import { CatRole } from '../domain/cat-role.type';

type CatRolesModelAttributes = Optional<CatRole, 'roleId'>;

export class CatRolesModel extends Model<CatRole, CatRolesModelAttributes> implements CatRole {
  declare roleId: number;
  declare roleName: string;
  declare roleDesc: string;
}


CatRolesModel.init(
  {
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'role_id',
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'role_name',
    },
    roleDesc: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'role_desc',
    },
  },
  {
    sequelize,
    modelName: 'CatRole',
    tableName: 'cat_roles',
    timestamps: false,
  },
);