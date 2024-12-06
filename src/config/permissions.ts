import type { RolePermissions } from "../types/rbac";

export const rolePermissions: RolePermissions = {
  admin: [
    { action: "create", resource: "*" },
    { action: "read", resource: "*" },
    { action: "update", resource: "*" },
    { action: "delete", resource: "*" },
    { action: "list", resource: "*" },
  ],
  manager: [
    // Products permissions
    { action: "create", resource: "products" },
    { action: "read", resource: "products" },
    { action: "update", resource: "products" },
    { action: "list", resource: "products" },

    // Customers permissions
    { action: "read", resource: "customers" },
    { action: "list", resource: "customers" },

    // Purchases permissions
    { action: "create", resource: "purchases" },
    { action: "read", resource: "purchases" },
    { action: "list", resource: "purchases" },
  ],
  user: [
    // Can only read and list products
    { action: "read", resource: "products" },
    { action: "list", resource: "products" },

    // No access to customers

    // Limited purchases access
    { action: "read", resource: "purchases" },
    { action: "list", resource: "purchases" },
  ],
};
