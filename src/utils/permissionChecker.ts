import { rolePermissions } from "../config/permissions";
import type { Permission, Role } from "../types/rbac";

export const createPermissionChecker = (role: Role | null) => {
  return (action: Permission["action"], resource: string): boolean => {
    if (!role) return false;

    const permissions = rolePermissions[role];
    if (!permissions) return false;

    return permissions.some(
      (permission) =>
        (permission.resource === "*" || permission.resource === resource) &&
        permission.action === action,
    );
  };
};
