export type Role = "admin" | "manager" | "user";

export type Permission = {
  action: "create" | "read" | "update" | "delete" | "list";
  resource: string;
  ownership?: "own" | "any";
};

export type RolePermissions = {
  [key in Role]: Permission[];
};
