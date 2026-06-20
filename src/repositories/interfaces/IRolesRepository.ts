import { CatRole } from "../../models/domain/cat-role.type";
import { CatPermission } from "../../models/domain/cat-permission.type";

export interface IRolesRepository {
    getRolesByUserId(userId: number): Promise<CatRole[]>;
    getPermissionsByRoleId(roleId: number): Promise<CatPermission[]>;
}