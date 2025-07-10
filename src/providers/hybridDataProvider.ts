import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  CreateParams,
  UpdateParams,
  DeleteParams,
  DeleteManyParams,
} from "react-admin";
import { createTrackingSupabaseProvider } from "./trackingSupabaseProvider";
import { supabaseClient } from "../supabase";
import type { QueryClient } from "@tanstack/react-query";
import type { Customer } from "../types/database";

// Note: We implement the data provider methods directly using Supabase
// The React Query hooks are available for direct component usage

interface HybridDataProviderOptions {
  queryClient: QueryClient;
  checkPermission: (
    action: "create" | "read" | "update" | "delete" | "list",
    resource: string,
    recordUserId?: string,
  ) => Promise<boolean>;
}

/**
 * Hybrid Data Provider that uses React Query for enhanced performance
 * while maintaining React Admin compatibility
 */
export const createHybridDataProvider = (
  options: HybridDataProviderOptions,
): DataProvider => {
  const { queryClient, checkPermission } = options;

  // Get the base tracking data provider as fallback
  const baseDataProvider = createTrackingSupabaseProvider(
    supabaseClient,
    checkPermission,
  );

  return {
    ...baseDataProvider,

    // Enhanced getList for customers using React Query
    getList: async (resource: string, params: GetListParams) => {
      if (resource === "customers") {
        try {
          // Extract React Admin parameters with defaults
          const { page = 1, perPage = 10 } = params.pagination || {};
          const { field = "id", order = "ASC" } = params.sort || {};
          const filter = params.filter || {};

          // Use React Query hook logic directly
          let query = supabaseClient
            .from("customers")
            .select("*", { count: "exact" });

          // Apply filters
          if (filter.q) {
            query = query.or(
              `fullname.ilike.%${filter.q}%,email.ilike.%${filter.q}%`,
            );
          }
          if (filter.fullname) {
            query = query.ilike("fullname", `%${filter.fullname}%`);
          }
          if (filter.email) {
            query = query.ilike("email", `%${filter.email}%`);
          }
          if (filter.created_by) {
            query = query.eq("created_by", filter.created_by);
          }

          // Apply sorting
          query = query.order(field, { ascending: order === "ASC" });

          // Apply pagination
          const from = (page - 1) * perPage;
          const to = from + perPage - 1;
          query = query.range(from, to);

          const { data, error, count } = await query;

          if (error) throw error;

          // Cache the result in React Query
          queryClient.setQueryData(
            ["customers", "list", { page, perPage }, { field, order }, filter],
            {
              data: data || [],
              total: count || 0,
            },
          );

          // Return in React Admin format
          return {
            data: data || [],
            total: count || 0,
          };
        } catch (error) {
          console.error(
            "Enhanced getList failed for customers, falling back:",
            error,
          );
          // Fallback to base data provider
          return baseDataProvider.getList(resource, params);
        }
      }

      // For non-customer resources, use base data provider
      return baseDataProvider.getList(resource, params);
    },

    // Enhanced getOne for customers
    getOne: async (resource: string, params: GetOneParams) => {
      if (resource === "customers") {
        try {
          const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .eq("id", params.id)
            .single();

          if (error) throw error;

          // Cache the result in React Query
          queryClient.setQueryData(["customers", "detail", params.id], data);

          return { data };
        } catch (error) {
          console.error(
            "Enhanced getOne failed for customers, falling back:",
            error,
          );
          return baseDataProvider.getOne(resource, params);
        }
      }

      return baseDataProvider.getOne(resource, params);
    },

    // Enhanced create for customers with optimistic updates
    create: async (resource: string, params: CreateParams) => {
      if (resource === "customers") {
        try {
          // Check permissions first
          const hasPermission = await checkPermission("create", resource);
          if (!hasPermission) {
            throw new Error("ra.notification.unauthorized");
          }

          const { data, error } = await supabaseClient
            .from("customers")
            .insert([params.data])
            .select()
            .single();

          if (error) throw error;

          // Update React Query cache optimistically
          queryClient.setQueryData(["customers", "detail", data.id], data);

          // Invalidate list queries to trigger refetch
          queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });

          return { data };
        } catch (error) {
          console.error(
            "Enhanced create failed for customers, falling back:",
            error,
          );
          return baseDataProvider.create(resource, params);
        }
      }

      return baseDataProvider.create(resource, params);
    },

    // Enhanced update for customers with optimistic updates
    update: async (resource: string, params: UpdateParams) => {
      if (resource === "customers") {
        try {
          // Check permissions first
          const hasPermission = await checkPermission("update", resource);
          if (!hasPermission) {
            throw new Error("ra.notification.unauthorized");
          }

          const { data, error } = await supabaseClient
            .from("customers")
            .update(params.data)
            .eq("id", params.id)
            .select()
            .single();

          if (error) throw error;

          // Update React Query cache
          queryClient.setQueryData(["customers", "detail", params.id], data);

          // Update the customer in list caches
          queryClient.setQueriesData(
            { queryKey: ["customers", "list"] },
            (old: { data: Customer[]; total: number } | undefined) => {
              if (!old) return old;

              return {
                ...old,
                data: old.data.map((customer: Customer) =>
                  customer.id === params.id ? data : customer,
                ),
              };
            },
          );

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });

          return { data };
        } catch (error) {
          console.error(
            "Enhanced update failed for customers, falling back:",
            error,
          );
          return baseDataProvider.update(resource, params);
        }
      }

      return baseDataProvider.update(resource, params);
    },

    // Enhanced delete for customers with optimistic updates
    delete: async (resource: string, params: DeleteParams) => {
      if (resource === "customers") {
        try {
          // Check permissions first
          const hasPermission = await checkPermission("delete", resource);
          if (!hasPermission) {
            throw new Error("ra.notification.unauthorized");
          }

          const { error } = await supabaseClient
            .from("customers")
            .delete()
            .eq("id", params.id);

          if (error) throw error;

          // Remove from React Query cache
          queryClient.removeQueries({
            queryKey: ["customers", "detail", params.id],
          });

          // Remove from list caches
          queryClient.setQueriesData(
            { queryKey: ["customers", "list"] },
            (old: { data: Customer[]; total: number } | undefined) => {
              if (!old) return old;

              return {
                ...old,
                data: old.data.filter(
                  (customer: Customer) => customer.id !== params.id,
                ),
                total: Math.max(0, old.total - 1),
              };
            },
          );

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["purchases"] });

          return { data: { id: params.id } };
        } catch (error) {
          console.error(
            "Enhanced delete failed for customers, falling back:",
            error,
          );
          return baseDataProvider.delete(resource, params);
        }
      }

      return baseDataProvider.delete(resource, params);
    },

    // Enhanced deleteMany for customers
    deleteMany: async (resource: string, params: DeleteManyParams) => {
      if (resource === "customers") {
        try {
          // Check permissions first
          const hasPermission = await checkPermission("delete", resource);
          if (!hasPermission) {
            throw new Error("ra.notification.unauthorized");
          }

          const { error } = await supabaseClient
            .from("customers")
            .delete()
            .in("id", params.ids);

          if (error) throw error;

          // Remove from React Query cache
          params.ids.forEach((id) => {
            queryClient.removeQueries({
              queryKey: ["customers", "detail", String(id)],
            });
          });

          // Remove from list caches
          queryClient.setQueriesData(
            { queryKey: ["customers", "list"] },
            (old: { data: Customer[]; total: number } | undefined) => {
              if (!old) return old;

              return {
                ...old,
                data: old.data.filter(
                  (customer: Customer) =>
                    !params.ids.includes(String(customer.id)),
                ),
                total: Math.max(0, old.total - params.ids.length),
              };
            },
          );

          // Invalidate related queries
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          queryClient.invalidateQueries({ queryKey: ["purchases"] });

          return { data: params.ids };
        } catch (error) {
          console.error(
            "Enhanced deleteMany failed for customers, falling back:",
            error,
          );
          return baseDataProvider.deleteMany(resource, params);
        }
      }

      return baseDataProvider.deleteMany(resource, params);
    },
  };
};
