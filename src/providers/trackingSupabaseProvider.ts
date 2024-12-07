import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseDataProvider } from "ra-supabase";
import type { Permission } from "../types/rbac";
import type { Product, Customer, Purchase } from "../types/database";
import type {
  CreateParams,
  UpdateParams,
  DeleteParams,
  DeleteManyParams,
} from "react-admin";

// Interface for audit log entries
interface LogEntry {
  timestamp: Date; // When the operation occurred
  operation: string; // Type of operation (CREATE, UPDATE, DELETE, etc.)
  resource: string; // Which resource was affected (customers, products, etc.)
  user_id?: string; // Who performed the operation
  user_email?: string; // Email of user who performed the operation
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
      const { error } = await supabaseClient.from("audit_logs").insert([entry]);
      if (error) throw error;
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
          user_email: user?.email,
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
          user_email: user?.email,
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
      const hasPermission = await checkPermission("update", resource);

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
          user_email: user?.email,
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
          user_email: user?.email,
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

      // First get the record to check ownership
      const { data: record } = await supabaseClient
        .from(resource)
        .select("created_by")
        .eq("id", params.id)
        .single();

      const hasPermission = await checkPermission(
        "delete",
        resource,
        record?.created_by,
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
          user_email: user?.email,
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
          user_email: user?.email,
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
            .in("id", params.ids)) as { data: Purchase[] | null };
          names = (data || []).map((record) =>
            record.products?.name && record.customers?.fullname
              ? `${record.products.name} for ${record.customers.fullname}`
              : record.id,
          );
        }

        const response = await baseDataProvider.deleteMany(resource, params);

        await logOperation({
          timestamp: new Date(),
          operation: "BULK_DELETE",
          resource,
          user_id: user?.id,
          user_email: user?.email,
          status: "success",
          details: `Bulk deleted ${resource}: ${names.join(", ")}`,
        });
        return response;
      } catch (error) {
        await logOperation({
          timestamp: new Date(),
          operation: "BULK_DELETE",
          resource,
          user_id: user?.id,
          user_email: user?.email,
          status: "error",
          details: `Failed to bulk delete ${resource}: ${error}`,
        });
        throw new Error("ra.notification.http_error");
      }
    },
  };
};
