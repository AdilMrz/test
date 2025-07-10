import type { ReactNode } from "react";
import { useState, useEffect, useMemo, memo } from "react";
import { useRBAC } from "../contexts/RBACContext";
import type { Permission } from "../types/rbac";

interface ProtectedProps {
  children: ReactNode;
  action: Permission["action"];
  resource: string;
  recordUserId?: string;
}

const ProtectedComponent = ({
  children,
  action,
  resource,
  recordUserId,
}: ProtectedProps) => {
  const { checkPermission } = useRBAC();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Memoize the permission key to avoid unnecessary re-checks
  const permissionKey = useMemo(
    () => `${action}:${resource}:${recordUserId || "none"}`,
    [action, resource, recordUserId],
  );

  useEffect(() => {
    let isCancelled = false;

    const checkAccess = async () => {
      try {
        const permission = await checkPermission(
          action,
          resource,
          recordUserId,
        );

        if (!isCancelled) {
          setHasPermission(permission);
          setIsLoading(false);
        }
      } catch (error) {
        if (!isCancelled) {
          setHasPermission(false);
          setIsLoading(false);
        }
      }
    };

    checkAccess();

    return () => {
      isCancelled = true;
    };
  }, [checkPermission, permissionKey]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};

// Memoize the component to prevent unnecessary re-renders
export const Protected = memo(ProtectedComponent);
