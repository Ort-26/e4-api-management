import { IRolesRepository } from "../interfaces/IRolesRepository";
import { CatRolesModel } from "../../models/sequelize/CatRolesModel";
import { CatRole } from "../../models/domain/cat-role.type";
import { CatPermission } from "../../models/domain/cat-permission.type";
import { CtlRolesPermissionsModel } from "../../models/sequelize/CtlRolesPermissionsModel";
import { CatPermissionsModel } from "../../models/sequelize/CatPermissionsModel";

export class RolesRepository implements IRolesRepository {
  async getRolesByUserId(roleId: number): Promise<CatRole[]> {
    const roles = await CatRolesModel.findByPk(roleId, {
      attributes: ['roleId', 'roleName', 'roleDesc'],
    });

    return roles ? [roles.get({ plain: true })] : [];
  }

  async getPermissionsByRoleId(roleId: number): Promise<CatPermission[]> {
    const rolePermissions = await CtlRolesPermissionsModel.findAll({
      where: { roleId },
      include: [
        {
          model: CatPermissionsModel,
          as: 'permission',
          attributes: ['permissionId', 'permissionName', 'permissionDesc'],
          required: true,
        },
      ],
    });

    return rolePermissions
      .map((rolePermission) => rolePermission.get('permission'))
      .filter((permission): permission is CatPermission => Boolean(permission));
  }
}