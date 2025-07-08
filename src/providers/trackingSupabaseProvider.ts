import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseDataProvider } from "ra-supabase";
import type { Permission } from "../types/rbac";
import type { Product, Customer, Purchase } from "../types/database";
import type {
  CreateParams,
  UpdateParams,
  DeleteParams,
  DeleteManyParams,
  GetListParams,
  GetOneParams,
} from "react-admin";

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

  const logOperation = async (entry: LogEntry) => {
    try {
      console.log("Logging operation:", entry);
      // Get user's full name from user_role table
      if (entry.user_id) {
        const { data: userData } = await supabaseClient
          .from("user_role")
          .select("fullname")
          .eq("user_id", entry.user_id)
          .single();
        console.log("User data from user_role:", userData);
        entry.user_fullname = userData?.fullname;

        // Get user's email
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        entry.user_email = user?.email;
      }

      // Convert Date object to ISO string for Postgres timestamptz
      const logEntry = {
        ...entry,
        timestamp: entry.timestamp.toISOString(),
      };

      console.log("Inserting into audit_logs:", logEntry);
      const { data, error } = await supabaseClient
        .from("audit_logs")
        .insert([logEntry])
        .select()
        .single();

      if (error) {
        console.error("Error inserting into audit_logs:", error.message);
        throw error;
      }
      console.log("Successfully logged operation:", data);
    } catch (error) {
      console.error("Failed to log operation:", error);
    }
  };

  return {
    ...baseDataProvider,
    create: async (resource: string, params: CreateParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      const hasPermission = await checkPermission("create", resource);

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      const finalParams = {
        ...params,
        data: {
          ...params.data,
          created_by: user?.id,
        },
      };

      try {
        const response = await baseDataProvider.create(resource, finalParams);
        let recordName =
          params.data.fullname || params.data.name || response.data.id;

        if (resource === "purchases") {
          const { data: customer } = await supabaseClient
            .from("customers")
            .select("fullname")
            .eq("id", params.data.customer_id)
            .single();

          const { data: product } = await supabaseClient
            .from("products")
            .select("name")
            .eq("id", params.data.product_id)
            .single();

          recordName = `${product?.name || "Unknown Product"} for ${customer?.fullname || "Unknown Customer"}`;
        }

        await logOperation({
          timestamp: new Date(),
          operation: "CREATE",
          resource,
          user_id: user?.id,
          status: "success",
          details: `Created ${resource}: ${recordName}`,
        });
        return response;
      } catch (error) {
        await logOperation({
          timestamp: new Date(),
          operation: "CREATE",
          resource,
          user_id: user?.id,
          status: "error",
          details: `Failed to create ${resource}: ${error}`,
        });
        throw new Error("ra.notification.http_error");
      }
    },
    update: async (resource: string, params: UpdateParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      // Get user role
      const { data: userRole } = await supabaseClient
        .from("user_role")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      // For admin and manager, skip ownership check
      const hasPermission = await checkPermission(
        "update",
        resource,
        ["admin", "manager"].includes(userRole?.role || "")
          ? undefined
          : user?.id,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      try {
        // Get the record name before update
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
          const { data: customer } = await supabaseClient
            .from("customers")
            .select("fullname")
            .eq("id", params.data.customer_id)
            .single();

          const { data: product } = await supabaseClient
            .from("products")
            .select("name")
            .eq("id", params.data.product_id)
            .single();

          recordName = `${product?.name || "Unknown Product"} for ${customer?.fullname || "Unknown Customer"}`;
        }

        const response = await baseDataProvider.update(resource, params);

        await logOperation({
          timestamp: new Date(),
          operation: "UPDATE",
          resource,
          user_id: user?.id,
          status: "success",
          details: `Updated ${resource}: ${recordName}`,
        });
        return response;
      } catch (error) {
        await logOperation({
          timestamp: new Date(),
          operation: "UPDATE",
          resource,
          user_id: user?.id,
          status: "error",
          details: `Failed to update ${resource}: ${error}`,
        });
        throw new Error("ra.notification.http_error");
      }
    },
    delete: async (resource: string, params: DeleteParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      // Get user role
      const { data: userRole } = await supabaseClient
        .from("user_role")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      // First get the record to check ownership
      const { data: record } = await supabaseClient
        .from(resource)
        .select("created_by")
        .eq("id", params.id)
        .single();

      // For admin and manager, skip ownership check
      const hasPermission = await checkPermission(
        "delete",
        resource,
        ["admin", "manager"].includes(userRole?.role || "")
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

        await logOperation({
          timestamp: new Date(),
          operation: "DELETE",
          resource,
          user_id: user?.id,
          status: "success",
          details: `Deleted ${resource}: ${recordName}`,
        });
        return response;
      } catch (error) {
        await logOperation({
          timestamp: new Date(),
          operation: "DELETE",
          resource,
          user_id: user?.id,
          status: "error",
          details: `Failed to delete ${resource}: ${error}`,
        });
        throw new Error("ra.notification.http_error");
      }
    },
    deleteMany: async (resource: string, params: DeleteManyParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
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

        await logOperation({
          timestamp: new Date(),
          operation: "BULK_DELETE",
          resource,
          user_id: user?.id,
          status: "success",
          details: `Bulk deleted ${resource}: ${names.join(", ")}`,
        });
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

        await logOperation({
          timestamp: new Date(),
          operation: "BULK_DELETE",
          resource,
          user_id: user?.id,
          status: "error",
          details: `Failed to bulk delete ${resource}: ${friendlyMessage}`,
        });
        throw new Error(friendlyMessage);
      }
    },
    getList: async (resource: string, params: GetListParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        console.warn("No authenticated user found");
        throw new Error("ra.notification.unauthorized");
      }

      // Get user role first
      const { data: userRole, error: roleError } = await supabaseClient
        .from("user_role")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (roleError || !userRole) {
        console.warn("User role not found or error:", {
          userId: user.id,
          error: roleError,
          userRole,
        });
        // For development, allow access with default 'user' role if no role is set
        if (import.meta.env.MODE === "development" && !userRole) {
          console.warn("Development mode: Using default 'user' role");
          // Create a default user role entry for development
          const { error: insertError } = await supabaseClient
            .from("user_role")
            .insert({ user_id: user.id, role: "user" });

          if (insertError) {
            console.error("Failed to create default user role:", insertError);
            throw new Error("ra.notification.unauthorized");
          }
        } else {
          throw new Error("ra.notification.unauthorized");
        }
      }

      // Get the actual role (either from DB or default 'user')
      const actualRole = userRole?.role || "user";

      // Check permissions without ownership for admin and manager
      const hasPermission = await checkPermission(
        "list",
        resource,
        ["admin", "manager"].includes(actualRole) ? undefined : user.id,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      // If admin, manager, or unrestricted resources, return unfiltered list
      if (
        actualRole === "admin" ||
        actualRole === "manager" ||
        resource === "products" ||
        resource === "customers"
      ) {
        return baseDataProvider.getList(resource, params);
      }

      // For other roles and resources, apply ownership filter
      const newParams = {
        ...params,
        filter: {
          ...params.filter,
          created_by: user.id,
        },
      };
      return baseDataProvider.getList(resource, newParams);
    },

    getOne: async (resource: string, params: GetOneParams) => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      // Get user role
      const { data: userRole } = await supabaseClient
        .from("user_role")
        .select("role")
        .eq("user_id", user?.id)
        .single();

      const response = await baseDataProvider.getOne(resource, params);

      // Check permissions without ownership for admin and manager
      const hasPermission = await checkPermission(
        "read",
        resource,
        ["admin", "manager"].includes(userRole?.role || "")
          ? undefined
          : user?.id,
      );

      if (!hasPermission) {
        throw new Error("ra.notification.unauthorized");
      }

      return response;
    },
  };
};
