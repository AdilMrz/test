import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";
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
  // Cache for user ID to avoid repeated auth calls
  const userIdCache = useMemo(() => {
    let cachedUserId: string | null = null;
    let cachePromise: Promise<string | null> | null = null;

    return {
      async getUserId(): Promise<string | null> {
        if (cachedUserId) return cachedUserId;
        if (cachePromise) return cachePromise;

        cachePromise = supabaseClient.auth
          .getUser()
          .then(({ data: { user } }) => {
            cachedUserId = user?.id || null;
            cachePromise = null;
            return cachedUserId;
          });

        return cachePromise;
      },
      clear() {
        cachedUserId = null;
        cachePromise = null;
      },
    };
  }, []);

  // Memoized permission checker
  const permissionChecker = useMemo(() => {
    if (!role) return null;
    return rolePermissions[role];
  }, [role]);

  const checkPermission = useCallback(
    async (
      action: Permission["action"],
      resource: string,
      recordUserId?: string,
    ): Promise<boolean> => {
      if (!role || !permissionChecker) return false;

      const userId = await userIdCache.getUserId();

      return permissionChecker.some((permission) => {
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
    },
    [role, permissionChecker, userIdCache],
  );

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
