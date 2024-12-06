export type Role = "admin" | "manager" | "user";

export interface Permission {
  action: "create" | "read" | "update" | "delete" | "list";
  resource: string;
}

export interface RolePermissions {
  [key: string]: Permission[];
}
