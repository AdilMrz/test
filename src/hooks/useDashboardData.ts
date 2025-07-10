import { useQueries } from "@tanstack/react-query";
import { supabaseClient } from "../supabase";
import type { Product, Customer, Purchase } from "../types/database";

interface DashboardFilters {
  startDate?: Date | null;
  endDate?: Date | null;
}

export const useDashboardData = (filters: DashboardFilters = {}) => {
  const { startDate, endDate } = filters;

  const results = useQueries({
    queries: [
      {
        queryKey: ["dashboard", "products"],
        queryFn: async (): Promise<Product[]> => {
          const { data, error } = await supabaseClient
            .from("products")
            .select("*")
            .order("id", { ascending: true })
            .limit(50);

          if (error) throw error;
          return data || [];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        cacheTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
      },
      {
        queryKey: ["dashboard", "purchases", { startDate, endDate }],
        queryFn: async (): Promise<Purchase[]> => {
          let query = supabaseClient
            .from("purchases")
            .select(
              `
              *,
              customers!inner(id, fullname),
              products!inner(id, name)
            `,
            )
            .order("purchase_date", { ascending: false })
            .limit(1000);

          if (startDate) {
            const startDateStr = startDate.toISOString().split("T")[0];
            query = query.gte("purchase_date", startDateStr);
          }

          if (endDate) {
            const endDateStr = endDate.toISOString().split("T")[0];
            query = query.lte("purchase_date", endDateStr);
          }

          const { data, error } = await query;

          if (error) {
            throw error;
          }

          return data || [];
        },
        staleTime: 30 * 1000, // 30 seconds (more frequent for real-time feel)
        cacheTime: 5 * 60 * 1000, // 5 minutes
        refetchInterval: 60 * 1000, // Refetch every minute
        refetchOnWindowFocus: true,
        retry: 2,
      },
      {
        queryKey: ["dashboard", "customers"],
        queryFn: async (): Promise<Customer[]> => {
          const { data, error } = await supabaseClient
            .from("customers")
            .select("*")
            .order("id", { ascending: true })
            .limit(1000);

          if (error) throw error;
          return data || [];
        },
        staleTime: 10 * 60 * 1000, // 10 minutes (customers change less frequently)
        cacheTime: 15 * 60 * 1000, // 15 minutes
        retry: 2,
      },
    ],
  });

  const [productsQuery, purchasesQuery, customersQuery] = results;

  return {
    products: {
      data: productsQuery.data,
      isLoading: productsQuery.isLoading,
      error: productsQuery.error,
      refetch: productsQuery.refetch,
    },
    purchases: {
      data: purchasesQuery.data,
      isLoading: purchasesQuery.isLoading,
      error: purchasesQuery.error,
      refetch: purchasesQuery.refetch,
    },
    customers: {
      data: customersQuery.data,
      isLoading: customersQuery.isLoading,
      error: customersQuery.error,
      refetch: customersQuery.refetch,
    },
    // Combined loading state
    isLoading:
      productsQuery.isLoading ||
      purchasesQuery.isLoading ||
      customersQuery.isLoading,
    // Combined error state
    hasError: !!(
      productsQuery.error ||
      purchasesQuery.error ||
      customersQuery.error
    ),
    errors: {
      products: productsQuery.error,
      purchases: purchasesQuery.error,
      customers: customersQuery.error,
    },
    // Refetch all data
    refetchAll: () => {
      productsQuery.refetch();
      purchasesQuery.refetch();
      customersQuery.refetch();
    },
  };
};
