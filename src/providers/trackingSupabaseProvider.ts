import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseDataProvider } from "ra-supabase";
import type { CreateParams, UpdateParams, DeleteParams } from "react-admin";

// Interfaces for the different types of resources in the system
interface Purchase {
  id: number;
  product_id: number;
  customer_id: number;
  price: number;
  purchase_date: string;
}

interface Customer {
  id: number;
  fullname: string;
  email: string;
  address: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
}

// Maps resource names to their respective types
interface ResourceData {
  purchases: Purchase;
  customers: Customer;
  products: Product;
}

// Interface for audit log entries
interface LogEntry {
  timestamp: Date;
  operation: string;
  resource: string;
  user_id?: string;
  user_email: string;
  status: "success" | "error";
  details?: string;
}

export const createTrackingSupabaseProvider = (supabase: SupabaseClient) => {
  // Initialize the base data provider
  const dataProvider = supabaseDataProvider({
    instanceUrl: import.meta.env.VITE_SUPABASE_URL,
    apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    supabaseClient: supabase,
  });

  // Helper function to log operations to the audit_logs table
  const logToSupabase = async (entry: LogEntry) => {
    console.log("Attempting to log operation:", entry);
    try {
      const { details, ...logEntry } = entry;
      const finalEntry = details ? { ...logEntry, details } : logEntry;
      const { error } = await supabase.from("audit_logs").insert([finalEntry]);
      if (error) {
        console.error("Error logging to Supabase:", error);
        throw error;
      }
      console.log("Successfully logged operation");
    } catch (error) {
      console.error("Failed to log operation:", error);
    }
  };

  // Get current authenticated user details
  const getCurrentUser = async () => {
    console.log("Getting current user");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log("Current user:", user);
    return {
      id: user?.id,
      email: user?.email,
    };
  };

  // Helper function to get a string identifier for any resource type
  const getIdentifier = (data: ResourceData[keyof ResourceData]): string => {
    if ("name" in data && typeof data.name === "string") return data.name;
    if ("fullname" in data && typeof data.fullname === "string")
      return data.fullname;
    if ("email" in data && typeof data.email === "string") return data.email;
    return String(data.id);
  };

  // Type guard to ensure resource is a valid key of ResourceData
  const isValidResource = (
    resource: string,
  ): resource is keyof ResourceData => {
    return ["purchases", "customers", "products"].includes(resource);
  };

  // Format details for audit log based on resource type
  const getFormattedDetails = async <T extends keyof ResourceData>(
    resource: T,
    data: ResourceData[T],
  ) => {
    switch (resource) {
      case "purchases": {
        const purchase = data as Purchase;
        const { data: customer } = await supabase
          .from("customers")
          .select("fullname")
          .eq("id", purchase.customer_id)
          .single();
        const { data: product } = await supabase
          .from("products")
          .select("name")
          .eq("id", purchase.product_id)
          .single();
        return `${product?.name} for ${customer?.fullname}`;
      }

      case "customers": {
        const customer = data as Customer;
        return `Customer: ${customer.fullname} (${customer.email})`;
      }

      case "products": {
        const product = data as Product;
        return `Product: ${product.name}${product.description ? ` - ${product.description}` : ""}`;
      }

      default:
        return getIdentifier(data);
    }
  };

  // Return enhanced data provider with audit logging
  return {
    ...dataProvider,
    // Override create operation to add audit logging
    create: async (resource: string, params: CreateParams) => {
      console.log("Create operation called for resource:", resource);
      const user = await getCurrentUser();
      const entry: LogEntry = {
        timestamp: new Date(),
        operation: "CREATE",
        resource,
        user_id: user.id,
        user_email: user.email || "",
        status: "success",
      };

      try {
        // Remove price and stock fields if they're undefined for products
        const finalParams =
          resource === "products"
            ? {
                ...params,
                data: {
                  name: params.data.name,
                  description: params.data.description,
                },
              }
            : params;

        const response = await dataProvider.create(resource, finalParams);
        if (isValidResource(resource)) {
          entry.details = `Created new ${await getFormattedDetails(resource, params.data as ResourceData[typeof resource])}`;
        }
        await logToSupabase(entry);
        return response;
      } catch (error) {
        console.error("Error in create operation:", error);
        await logToSupabase({ ...entry, status: "error" });
        throw error;
      }
    },

    // Override update operation to add audit logging
    update: async (resource: string, params: UpdateParams) => {
      console.log("Update operation called for resource:", resource);
      const user = await getCurrentUser();
      const entry: LogEntry = {
        timestamp: new Date(),
        operation: "EDIT",
        resource,
        user_id: user.id,
        user_email: user.email || "",
        status: "success",
      };

      try {
        const response = await dataProvider.update(resource, params);
        if (isValidResource(resource)) {
          entry.details = `Updated ${await getFormattedDetails(resource, params.data as ResourceData[typeof resource])}`;
        }
        await logToSupabase(entry);
        return response;
      } catch (error) {
        console.error("Error in update operation:", error);
        await logToSupabase({ ...entry, status: "error" });
        throw error;
      }
    },

    // Override delete operation to add audit logging
    delete: async (resource: string, params: DeleteParams) => {
      console.log("Delete operation called for resource:", resource);
      const user = await getCurrentUser();
      const entry: LogEntry = {
        timestamp: new Date(),
        operation: "DELETE",
        resource,
        user_id: user.id,
        user_email: user.email || "",
        status: "success",
      };

      try {
        // Special handling for purchase deletions
        if (resource === "purchases") {
          const { data: purchase } = await supabase
            .from("purchases")
            .select(
              `
              *,
              customers (fullname),
              products (name)
            `,
            )
            .eq("id", params.id)
            .single();

          if (purchase) {
            entry.details = `Deleted purchase: ${purchase.products?.name} for ${purchase.customers?.fullname}`;
          }
        } else if (isValidResource(resource)) {
          const { data } = await supabase
            .from(resource)
            .select("*")
            .eq("id", params.id)
            .single();

          if (data) {
            entry.details = `Deleted ${await getFormattedDetails(resource, data)}`;
          }
        }

        const response = await dataProvider.delete(resource, params);
        await logToSupabase(entry);
        return response;
      } catch (error) {
        console.error("Error in delete operation:", error);
        await logToSupabase({ ...entry, status: "error" });
        throw error;
      }
    },

    deleteMany: async (
      resource: string,
      params: { ids: (string | number)[] },
    ) => {
      console.log("Bulk delete operation called for resource:", resource);
      const user = await getCurrentUser();

      try {
        // Get details of items before deletion
        const itemDetails = await Promise.all(
          params.ids.map(async (id) => {
            const { data } = await supabase
              .from(resource)
              .select("*")
              .eq("id", id)
              .single();
            return data;
          }),
        );

        // Perform the delete operation
        const response = await dataProvider.deleteMany(resource, params);

        // Log each deleted item with its details
        for (let i = 0; i < params.ids.length; i++) {
          const item = itemDetails[i];
          if (!item) continue;

          const entry: LogEntry = {
            timestamp: new Date(),
            operation: "BULK_DELETE",
            resource,
            user_id: user.id,
            user_email: user.email || "",
            status: "success",
            details: isValidResource(resource)
              ? `Bulk deleted ${await getFormattedDetails(resource as keyof ResourceData, item)}`
              : `Bulk deleted ${resource} with ID: ${params.ids[i]}`,
          };
          await logToSupabase(entry);
        }

        return response;
      } catch (error) {
        console.error("Error in bulk delete operation:", error);
        const entry: LogEntry = {
          timestamp: new Date(),
          operation: "BULK_DELETE",
          resource,
          user_id: user.id,
          user_email: user.email || "",
          status: "error",
          details: `Failed to bulk delete ${params.ids.length} items from ${resource}`,
        };
        await logToSupabase(entry);
        throw error;
      }
    },
  };
};
