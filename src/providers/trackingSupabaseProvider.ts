import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseDataProvider } from "ra-supabase";
import type { Permission } from "../types/rbac";
import { rolePermissions } from "../config/permissions";
import type { Product, Customer, Purchase } from "../types/database";
import type {
  CreateParams,
  UpdateParams,
  DeleteParams,
  DeleteManyParams,
  GetListParams,
  GetOneParams,
} from "react-admin";

// Cache for user data to avoid repeated database calls
interface UserCache {
  user: { id: string; email?: string };
  role: string;
  fullname?: string;
  email?: string;
  timestamp: number;
}

const userCache = new Map<string, UserCache>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to get cached user data or fetch from database
const getCachedUserData = async (
  supabaseClient: SupabaseClient,
): Promise<UserCache | null> => {
  const {
    data: { user },
  } = await supabaseClient.auth.getUser();

  if (!user) return null;

  const cached = userCache.get(user.id);
  const now = Date.now();

  // Return cached data if it's still valid
  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached;
  }

  // Fetch fresh data from database
  try {
    const { data: userRole } = await supabaseClient
      .from("user_role")
      .select("role, fullname")
      .eq("user_id", user.id)
      .single();

    const userData: UserCache = {
      user: { id: user.id, email: user.email },
      role: userRole?.role || "user",
      fullname: userRole?.fullname,
      email: user.email,
      timestamp: now,
    };

    // Cache the data
    userCache.set(user.id, userData);
    return userData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

// Interface for audit log entries
interface LogEntry {
  timestamp: Date; // When the operation occurred
  operation: string; // Type of operation (CREATE, UPDATE, DELETE, etc.)
  resource: string; // Which resource was affected (customers, products, etc.)
  user_id?: string; // Who performed the operation
  user_email?: string; // Email of user who performed the operation
  user_fullname?: string; // Full name of user who performed the operation
  status: "success" | "error"; // Whether the operation succeeded or failed
  details?: string; // Additional information about the operation
}

export const createTrackingSupabaseProvider = (
  supabaseClient: SupabaseClient,
  checkPermission: (
    action: Permission["action"],
    resource: string,
    recordUserId?: string,
  ) => Promise<boolean>,
) => {
  const baseDataProvider = supabaseDataProvider({
    instanceUrl: import.meta.env.VITE_SUPABASE_URL,
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseClient,
  });

  const logOperation = async (entry: LogEntry, userData?: UserCache) => {
    try {
      console.log("Logging operation:", entry);

      // Use provided userData or get from cache if user_id is available
      if (entry.user_id && userData) {
        entry.user_fullname = userData.fullname;
        entry.user_email = userData.email;
      }

      // Convert Date object to ISO string for Postgres timestamptz
      const logEntry = {
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      };

      console.log("Inserting into audit_logs:", logEntry);

      // Use fire-and-forget for audit logging to avoid blocking the main operation
      const logPromise = supabaseClient.from("audit_logs").insert([logEntry]);

      Promise.resolve(logPromise)
        .then(({ error }) => {
          if (error) {
            console.error("Error inserting into audit_logs:", error.message);
          } else {
            console.log("Successfully logged operation");
          }
        })
        .catch((error: unknown) => {
          console.error("Failed to log operation:", error);
        });
    } catch (error) {
      console.error("Failed to log operation:", error);
    }
  };

  return {
    ...baseDataProvider,
    create: async (resource: string, params: CreateParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      const hasPermission = await checkPermission("create", resource);

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      const finalParams = {
        ...params,
        data: {
          ...params.data,
          created_by: userData.user.id,
        },
      };

      try {
        const response = await baseDataProvider.create(resource, finalParams);
        let recordName =
          params.data.fullname || params.data.name || response.data.id;

        if (resource === "purchases") {
          // Parallelize the customer and product queries
          const [customerResult, productResult] = await Promise.all([
            supabaseClient
              .from("customers")
              .select("fullname")
              .eq("id", params.data.customer_id)
              .single(),
            supabaseClient
              .from("products")
              .select("name")
              .eq("id", params.data.product_id)
              .single(),
          ]);

          recordName = `${productResult.data?.name || "Unknown Product"} for ${customerResult.data?.fullname || "Unknown Customer"}`;
        }

        logOperation(
          {
            timestamp: new Date(),
            operation: "CREATE",
            resource,
            user_id: userData.user.id,
            status: "success",
            details: `Created ${resource}: ${recordName}`,
          },
          userData,
        );
        return response;
      } catch (error) {
        logOperation(
          {
            timestamp: new Date(),
            operation: "CREATE",
            resource,
            user_id: userData.user.id,
            status: "error",
            details: `Failed to create ${resource}: ${error}`,
          },
          userData,
        );
        throw new Error("ra.notification.http_error");
      }
    },
    update: async (resource: string, params: UpdateParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      // Get the record to check ownership
      const { data: record } = await supabaseClient
        .from(resource)
        .select("created_by")
        .eq("id", params.id)
        .single();

      // For admin and manager, skip ownership check
      const hasPermission = await checkPermission(
        "update",
        resource,
        ["admin", "manager"].includes(userData.role)
          ? undefined
          : record?.created_by,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      try {
        // Get the record name before update - parallelize queries where possible
        let recordName = params.id;
        if (resource === "products") {
          const { data } = await supabaseClient
            .from("products")
            .select("name")
            .eq("id", params.id)
            .single();
          recordName = data?.name || params.id;
        } else if (resource === "customers") {
          const { data } = await supabaseClient
            .from("customers")
            .select("fullname")
            .eq("id", params.id)
            .single();
          recordName = data?.fullname || params.id;
        } else if (resource === "purchases") {
          // Parallelize the customer and product queries
          const [customerResult, productResult] = await Promise.all([
            supabaseClient
              .from("customers")
              .select("fullname")
              .eq("id", params.data.customer_id)
              .single(),
            supabaseClient
              .from("products")
              .select("name")
              .eq("id", params.data.product_id)
              .single(),
          ]);

          recordName = `${productResult.data?.name || "Unknown Product"} for ${customerResult.data?.fullname || "Unknown Customer"}`;
        }

        const response = await baseDataProvider.update(resource, params);

        logOperation(
          {
            timestamp: new Date(),
            operation: "UPDATE",
            resource,
            user_id: userData.user.id,
            status: "success",
            details: `Updated ${resource}: ${recordName}`,
          },
          userData,
        );
        return response;
      } catch (error) {
        logOperation(
          {
            timestamp: new Date(),
            operation: "UPDATE",
            resource,
            user_id: userData.user.id,
            status: "error",
            details: `Failed to update ${resource}: ${error}`,
          },
          userData,
        );
        throw new Error("ra.notification.http_error");
      }
    },
    delete: async (resource: string, params: DeleteParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      // Get the record to check ownership
      const { data: record } = await supabaseClient
        .from(resource)
        .select("created_by")
        .eq("id", params.id)
        .single();

      // For admin and manager, skip ownership check
      const hasPermission = await checkPermission(
        "delete",
        resource,
        ["admin", "manager"].includes(userData.role)
          ? undefined
          : record?.created_by,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      try {
        let recordName = params.id;
        if (resource === "products") {
          const { data } = (await supabaseClient
            .from("products")
            .select("id, name")
            .eq("id", params.id)
            .single()) as { data: Product | null };
          recordName = data?.name || params.id;
        } else if (resource === "customers") {
          const { data } = (await supabaseClient
            .from("customers")
            .select("id, fullname")
            .eq("id", params.id)
            .single()) as { data: Customer | null };
          recordName = data?.fullname || params.id;
        } else if (resource === "purchases") {
          const { data } = (await supabaseClient
            .from("purchases")
            .select(
              `
              id,
              customers:customers(id, fullname),
              products:products(id, name)
            `,
            )
            .eq("id", params.id)
            .single()) as { data: Purchase | null };
          recordName =
            data?.products?.name && data?.customers?.fullname
              ? `${data.products.name} for ${data.customers.fullname}`
              : params.id;
        }

        const response = await baseDataProvider.delete(resource, params);

        logOperation(
          {
            timestamp: new Date(),
            operation: "DELETE",
            resource,
            user_id: userData.user.id,
            status: "success",
            details: `Deleted ${resource}: ${recordName}`,
          },
          userData,
        );
        return response;
      } catch (error) {
        logOperation(
          {
            timestamp: new Date(),
            operation: "DELETE",
            resource,
            user_id: userData.user.id,
            status: "error",
            details: `Failed to delete ${resource}: ${error}`,
          },
          userData,
        );
        throw new Error("ra.notification.http_error");
      }
    },
    deleteMany: async (resource: string, params: DeleteManyParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      const hasPermission = await checkPermission("delete", resource);

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      try {
        let names: string[] = [];
        if (resource === "products") {
          const { data } = (await supabaseClient
            .from("products")
            .select("id, name")
            .in("id", params.ids)) as { data: Product[] | null };
          names = (data || []).map((record) => record.name || record.id);
        } else if (resource === "customers") {
          const { data } = (await supabaseClient
            .from("customers")
            .select("id, fullname")
            .in("id", params.ids)) as { data: Customer[] | null };
          names = (data || []).map((record) => record.fullname || record.id);
        }

        const response = await baseDataProvider.deleteMany(resource, params);

        logOperation(
          {
            timestamp: new Date(),
            operation: "BULK_DELETE",
            resource,
            user_id: userData.user.id,
            status: "success",
            details: `Bulk deleted ${resource}: ${names.join(", ")}`,
          },
          userData,
        );
        return response;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const isConstraintViolation = errorMessage.includes(
          "violates foreign key constraint",
        );
        const friendlyMessage = isConstraintViolation
          ? `Cannot delete ${resource} that have associated ${resource === "customers" ? "purchases" : "records"}`
          : errorMessage;

        logOperation(
          {
            timestamp: new Date(),
            operation: "BULK_DELETE",
            resource,
            user_id: userData.user.id,
            status: "error",
            details: `Failed to bulk delete ${resource}: ${friendlyMessage}`,
          },
          userData,
        );
        throw new Error(friendlyMessage);
      }
    },
    getList: async (resource: string, params: GetListParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      // Handle development mode role creation if needed
      if (import.meta.env.MODE === "development" && !userData.role) {
        console.warn("Development mode: Creating default 'user' role");
        try {
          await supabaseClient
            .from("user_role")
            .insert({ user_id: userData.user.id, role: "user" });
          userData.role = "user"; // Update cached data
        } catch (insertError) {
          console.error("Failed to create default user role:", insertError);
          throw new Error("ra.notification.unauthorized");
        }
      }

      // Check permissions without ownership for admin and manager
      const hasPermission = await checkPermission(
        "list",
        resource,
        ["admin", "manager"].includes(userData.role)
          ? undefined
          : userData.user.id,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      // Check if the permission allows "any" ownership or if user is admin/manager
      const permissions =
        rolePermissions[userData.role as keyof typeof rolePermissions] || [];
      const listPermission = permissions.find(
        (p: Permission) =>
          p.action === "list" &&
          (p.resource === "*" || p.resource === resource),
      );

      const allowsAnyOwnership =
        listPermission?.ownership === "any" || !listPermission?.ownership;

      // If admin, manager, or permission allows "any" ownership, return unfiltered list
      if (
        userData.role === "admin" ||
        userData.role === "manager" ||
        allowsAnyOwnership
      ) {
        return baseDataProvider.getList(resource, params);
      }

      // For ownership-restricted resources, apply ownership filter
      const newParams = {
        ...params,
        filter: {
          ...params.filter,
          created_by: userData.user.id,
        },
      };
      return baseDataProvider.getList(resource, newParams);
    },

    getOne: async (resource: string, params: GetOneParams) => {
      const userData = await getCachedUserData(supabaseClient);

      if (!userData) {
        console.warn("No authenticated user found - redirecting to login");
        throw new Error("ra.auth.auth_check_error");
      }

      const response = await baseDataProvider.getOne(resource, params);

      // Check permissions without ownership for admin and manager
      const hasPermission = await checkPermission(
        "read",
        resource,
        ["admin", "manager"].includes(userData.role)
          ? undefined
          : response.data?.created_by,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      return response;
    },
  };
};
