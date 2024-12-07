import { createContext, useContext, type ReactNode } from "react";
import type { Role, Permission } from "../types/rbac";
import { rolePermissions } from "../config/permissions";
import { supabaseClient } from "../supabase";

interface RBACContextType {
  role: Role | null;
  checkPermission: (
    action: Permission["action"],
    resource: string,
    recordUserId?: string,
  ) => Promise<boolean>;
}

const RBACContext = createContext<RBACContextType | undefined>(undefined);

export const RBACProvider = ({
  children,
  role,
}: {
  children: ReactNode;
  role: Role | null;
}) => {
  const checkPermission = async (
    action: Permission["action"],
    resource: string,
    recordUserId?: string,
  ): Promise<boolean> => {
    if (!role) return false;

    const permissions = rolePermissions[role];
    if (!permissions) return false;

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    const userId = user?.id;

    return permissions.some((permission) => {
      // Check if resource matches
      const resourceMatches =
        permission.resource === "*" || permission.resource === resource;

      // If no resource match, return false
      if (!resourceMatches) return false;

      // Check if action matches
      if (permission.action !== action) return false;

      // If no ownership requirement, permission is granted
      if (!permission.ownership) return true;

      // If ownership is "any", permission is granted
      if (permission.ownership === "any") return true;

      // If ownership is "own", check if user owns the record
      if (permission.ownership === "own") {
        // If no recordUserId provided, deny permission
        if (!recordUserId || !userId) return false;
        return recordUserId === userId;
      }

      return false;
    });
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
