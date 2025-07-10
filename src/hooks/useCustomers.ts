import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from "@tanstack/react-query";
import { supabaseClient } from "../supabase";
import type { Customer } from "../types/database";

// Types for React Query integration
interface CustomerListResult {
  data: Customer[];
  total: number;
}

interface CustomerFilters {
  q?: string; // Search query
  fullname?: string;
  email?: string;
  created_by?: string;
}

interface CustomerPagination {
  page: number;
  perPage: number;
}

interface CustomerSort {
  field: string;
  order: "ASC" | "DESC";
}

// Type for create customer input
type CreateCustomerInput = Omit<Customer, "id" | "created_at" | "updated_at">;

// Type for update customer input
interface UpdateCustomerInput {
  id: string;
  data: Partial<Customer>;
}

// Hook for getting paginated list of customers
export const useCustomers = (
  pagination: CustomerPagination = { page: 1, perPage: 10 },
  sort: CustomerSort = { field: "id", order: "ASC" },
  filter: CustomerFilters = {},
): UseQueryResult<CustomerListResult, Error> => {
  return useQuery({
    queryKey: ["customers", "list", pagination, sort, filter],
    queryFn: async (): Promise<CustomerListResult> => {
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
      query = query.order(sort.field, { ascending: sort.order === "ASC" });

      // Apply pagination
      const from = (pagination.page - 1) * pagination.perPage;
      const to = from + pagination.perPage - 1;
      query = query.range(from, to);

      const { data, error, count } = await query;

      if (error) throw error;

      return {
        data: data || [],
        total: count || 0,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    keepPreviousData: true, // Keep previous data while loading new page
  });
};

// Hook for getting a single customer
export const useCustomer = (
  id: string,
  enabled = true,
): UseQueryResult<Customer, Error> => {
  return useQuery({
    queryKey: ["customers", "detail", id],
    queryFn: async (): Promise<Customer> => {
      const { data, error } = await supabaseClient
        .from("customers")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: enabled && !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for creating a customer with optimistic updates
export const useCreateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerData: CreateCustomerInput) => {
      const { data, error } = await supabaseClient
        .from("customers")
        .insert([customerData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onMutate: async (newCustomer) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // Snapshot the previous value
      const previousCustomers = queryClient.getQueriesData({
        queryKey: ["customers"],
      });

      // Optimistically update to the new value
      queryClient.setQueriesData(
        { queryKey: ["customers", "list"] },
        (old: CustomerListResult | undefined) => {
          if (!old) return old;

          const optimisticCustomer = {
            ...newCustomer,
            id: `temp-${Date.now()}`, // Temporary ID
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          return {
            ...old,
            data: [optimisticCustomer, ...old.data],
            total: old.total + 1,
          };
        },
      );

      return { previousCustomers };
    },
    onError: (_err, _newCustomer, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCustomers) {
        context.previousCustomers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// Hook for updating a customer with optimistic updates
export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: UpdateCustomerInput) => {
      const { data: updatedData, error } = await supabaseClient
        .from("customers")
        .update(data)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return updatedData;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // Snapshot the previous value
      const previousCustomer = queryClient.getQueryData([
        "customers",
        "detail",
        id,
      ]);
      const previousCustomers = queryClient.getQueriesData({
        queryKey: ["customers", "list"],
      });

      // Optimistically update the individual customer
      queryClient.setQueryData(
        ["customers", "detail", id],
        (old: Customer | undefined) => {
          if (!old) return old;
          return { ...old, ...data, updated_at: new Date().toISOString() };
        },
      );

      // Optimistically update the customer in lists
      queryClient.setQueriesData(
        { queryKey: ["customers", "list"] },
        (old: CustomerListResult | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.map((customer: Customer) =>
              customer.id === id
                ? { ...customer, ...data, updated_at: new Date().toISOString() }
                : customer,
            ),
          };
        },
      );

      return { previousCustomer, previousCustomers };
    },
    onError: (_err, { id }, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCustomer) {
        queryClient.setQueryData(
          ["customers", "detail", id],
          context.previousCustomer,
        );
      }
      if (context?.previousCustomers) {
        context.previousCustomers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: (_data, _error, { id }) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["customers", "detail", id] });
      queryClient.invalidateQueries({ queryKey: ["customers", "list"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
};

// Hook for deleting a customer with optimistic updates
export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabaseClient
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      return id;
    },
    onMutate: async (id) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["customers"] });

      // Snapshot the previous values
      const previousCustomer = queryClient.getQueryData([
        "customers",
        "detail",
        id,
      ]);
      const previousCustomers = queryClient.getQueriesData({
        queryKey: ["customers", "list"],
      });

      // Optimistically remove the customer from lists
      queryClient.setQueriesData(
        { queryKey: ["customers", "list"] },
        (old: CustomerListResult | undefined) => {
          if (!old) return old;

          return {
            ...old,
            data: old.data.filter((customer: Customer) => customer.id !== id),
            total: Math.max(0, old.total - 1),
          };
        },
      );

      // Remove the individual customer query
      queryClient.removeQueries({ queryKey: ["customers", "detail", id] });

      return { previousCustomer, previousCustomers };
    },
    onError: (_err, id, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCustomer) {
        queryClient.setQueryData(
          ["customers", "detail", id],
          context.previousCustomer,
        );
      }
      if (context?.previousCustomers) {
        context.previousCustomers.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] }); // Customers affect purchases
    },
  });
};

// Hook for bulk operations
export const useBulkDeleteCustomers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabaseClient
        .from("customers")
        .delete()
        .in("id", ids);

      if (error) throw error;
      return ids;
    },
    onSuccess: () => {
      // Invalidate all customer-related queries
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
    },
  });
};

// Utility hook for prefetching customer data
export const usePrefetchCustomer = (): {
  prefetchCustomer: (id: string) => void;
} => {
  const queryClient = useQueryClient();

  return {
    prefetchCustomer: (id: string): void => {
      queryClient.prefetchQuery({
        queryKey: ["customers", "detail", id],
        queryFn: async (): Promise<Customer> => {
          const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .eq("id", id)
            .single();

          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};
