import { createContext, useContext, type ReactNode } from "react";
import type { Role, Permission } from "../types/rbac";
import { rolePermissions } from "../config/permissions";

interface RBACContextType {
  role: Role | null;
  checkPermission: (action: Permission["action"], resource: string) => boolean;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({
  children,
  role,
}: {
  children: ReactNode;
  role: Role | null;
}) => {
  const checkPermission = (
    action: Permission["action"],
    resource: string,
  ): boolean => {
    if (!role) return false;

    const permissions = rolePermissions[role];
    if (!permissions) return false;

    return permissions.some(
      (permission) =>
        (permission.resource === "*" || permission.resource === resource) &&
        permission.action === action,
    );
  };

  return (
    <RBACContext.Provider value={{ role, checkPermission }}>
      {children}
    </RBACContext.Provider>
  );
};

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (context === undefined) {
    throw new Error("useRBAC must be used within a RBACProvider");
  }
  return context;
};
