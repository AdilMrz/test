import type { ReactNode } from "react";
import { useRBAC } from "../contexts/RBACContext";
import type { Permission } from "../types/rbac";

interface ProtectedProps {
  children: ReactNode;
  action: Permission["action"];
  resource: string;
}

export const Protected = ({ children, action, resource }: ProtectedProps) => {
  const { checkPermission } = useRBAC();

  if (!checkPermission(action, resource)) {
    return null;
  }

  return <>{children}</>;
};
