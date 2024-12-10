import type { RolePermissions } from "../types/rbac";

export const rolePermissions: RolePermissions = {
  admin: [
    { action: "create", resource: "*" },
    { action: "read", resource: "*" },
    { action: "update", resource: "*" },
    { action: "delete", resource: "*" },
    { action: "list", resource: "*" },
    { action: "read", resource: "maintenance" },
    { action: "list", resource: "maintenance" },
  ],
  manager: [
    { action: "read", resource: "dashboard" },
    { action: "read", resource: "audit_logs" },
    { action: "list", resource: "audit_logs" },
    // Products permissions
    { action: "create", resource: "products" },
    { action: "update", resource: "products", ownership: "any" },
    { action: "delete", resource: "products", ownership: "any" },
    { action: "read", resource: "products" },
    { action: "list", resource: "products" },
    // Customers permissions
    { action: "create", resource: "customers" },
    { action: "update", resource: "customers", ownership: "any" },
    { action: "delete", resource: "customers", ownership: "any" },
    { action: "read", resource: "customers" },
    { action: "list", resource: "customers" },
    // Purchases permissions
    { action: "create", resource: "purchases" },
    { action: "update", resource: "purchases", ownership: "any" },
    { action: "delete", resource: "purchases", ownership: "any" },
    { action: "read", resource: "purchases" },
    { action: "list", resource: "purchases" },
  ],
  user: [
    { action: "create", resource: "products" },
    { action: "update", resource: "products", ownership: "own" },
    { action: "delete", resource: "products", ownership: "own" },
    { action: "read", resource: "products" },
    { action: "list", resource: "products" },
    { action: "create", resource: "customers" },
    { action: "update", resource: "customers", ownership: "own" },
    { action: "delete", resource: "customers", ownership: "own" },
    { action: "read", resource: "customers", ownership: "own" },
    { action: "list", resource: "customers", ownership: "own" },
    { action: "create", resource: "purchases" },
    { action: "update", resource: "purchases", ownership: "own" },
    { action: "delete", resource: "purchases", ownership: "own" },
    { action: "read", resource: "purchases", ownership: "own" },
    { action: "list", resource: "purchases", ownership: "own" },
  ],
};
