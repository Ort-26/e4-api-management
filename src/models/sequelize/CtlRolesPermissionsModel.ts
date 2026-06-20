import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/sequelize';
import { CatPermissionsRoles } from '../domain/ctl-permissions-roles.type';
import { CatPermissionsModel } from './CatPermissionsModel';
import { CatRolesModel } from './CatRolesModel';

export class CtlRolesPermissionsModel
  extends Model<CatPermissionsRoles>
  implements CatPermissionsRoles
{
  declare permissionId: number;
  declare roleId: number;
}

CtlRolesPermissionsModel.init(
  {
    permissionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'permission_id',
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'role_id',
    },
  },
  {
    sequelize,
    modelName: 'CtlRolesPermission',
    tableName: 'ctl_roles_permissions',
    timestamps: false,
  },
);

CtlRolesPermissionsModel.belongsTo(CatPermissionsModel, {
  foreignKey: 'permissionId',
  as: 'permission',
});

CtlRolesPermissionsModel.belongsTo(CatRolesModel, {
  foreignKey: 'roleId',
  as: 'role',
});