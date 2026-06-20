import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { CatPermission } from '../domain/cat-permission.type';

type CatPermissionsCreationAttributes = Optional<CatPermission, 'permissionId'>;

export class CatPermissionsModel
  extends Model<CatPermission, CatPermissionsCreationAttributes>
  implements CatPermission
{
  declare permissionId: number;
  declare permissionName: string;
  declare permissionDesc: string;
}

CatPermissionsModel.init(
  {
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      field: 'permission_id',
    },
    permissionName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'permission_name',
    },
    permissionDesc: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'permission_desc',
    },
  },
  {
    sequelize,
    modelName: 'CatPermission',
    tableName: 'cat_permissions',
    timestamps: false,
  },
);