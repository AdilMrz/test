import type { ReactNode } from "react";
import { useState, useEffect } from "react";
import { useRBAC } from "../contexts/RBACContext";
import type { Permission } from "../types/rbac";

interface ProtectedProps {
  children: ReactNode;
  action: Permission["action"];
  resource: string;
  recordUserId?: string;
}

export const Protected = ({
  children,
  action,
  resource,
  recordUserId,
}: ProtectedProps) => {
  const { checkPermission } = useRBAC();
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const permission = await checkPermission(
          action,
          resource,
          recordUserId,
        );
        setHasPermission(permission);
      } catch (error) {
        console.error("Error checking permission:", error);
        setHasPermission(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAccess();
  }, [checkPermission, action, resource, recordUserId]);

  if (isLoading) {
    return null; // or a loading spinner
  }

  if (!hasPermission) {
    return null;
  }

  return <>{children}</>;
};
