import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import type { Product, Customer, Purchase, UserRole } from "../types/database";

interface UseRealtimeDataOptions {
  enabled?: boolean;
}

export const useRealtimeData = (options: UseRealtimeDataOptions = {}) => {
  const { enabled = true } = options;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!enabled) return;

    // Products real-time subscription
    const productsSubscription = supabaseClient
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload: RealtimePostgresChangesPayload<Product>) => {
          // Invalidate all product-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "products"],
          });
          queryClient.invalidateQueries({ queryKey: ["products"] });

          // If it's a specific product update, invalidate that specific query too
          const productId =
            (payload.new as Product | null)?.id ||
            (payload.old as Product | null)?.id;
          if (productId) {
            queryClient.invalidateQueries({
              queryKey: ["products", productId],
            });
          }
        },
      )
      .subscribe();

    // Purchases real-time subscription
    const purchasesSubscription = supabaseClient
      .channel("purchases-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "purchases" },
        (payload: RealtimePostgresChangesPayload<Purchase>) => {
          // Invalidate all purchase-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "purchases"],
          });
          queryClient.invalidateQueries({ queryKey: ["purchases"] });

          // If it's a specific purchase update, invalidate that specific query too
          const purchaseId =
            (payload.new as Purchase | null)?.id ||
            (payload.old as Purchase | null)?.id;
          if (purchaseId) {
            queryClient.invalidateQueries({
              queryKey: ["purchases", purchaseId],
            });
          }
        },
      )
      .subscribe();

    // Customers real-time subscription
    const customersSubscription = supabaseClient
      .channel("customers-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customers" },
        (payload: RealtimePostgresChangesPayload<Customer>) => {
          // Invalidate all customer-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "customers"],
          });
          queryClient.invalidateQueries({ queryKey: ["customers"] });

          // If it's a specific customer update, invalidate that specific query too
          const customerId =
            (payload.new as Customer | null)?.id ||
            (payload.old as Customer | null)?.id;
          if (customerId) {
            queryClient.invalidateQueries({
              queryKey: ["customers", customerId],
            });
          }
        },
      )
      .subscribe();

    // User roles real-time subscription (for RBAC updates)
    const userRolesSubscription = supabaseClient
      .channel("user-roles-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_role" },
        (payload: RealtimePostgresChangesPayload<UserRole>) => {
          const userId =
            (payload.new as UserRole | null)?.user_id ||
            (payload.old as UserRole | null)?.user_id;

          // Invalidate user profile queries
          queryClient.invalidateQueries({ queryKey: ["user", "profile"] });

          // If it's the current user, invalidate their specific data
          if (userId) {
            queryClient.invalidateQueries({
              queryKey: ["user", "profile", userId],
            });
          }
        },
      )
      .subscribe();

    // Cleanup function
    return () => {
      productsSubscription.unsubscribe();
      purchasesSubscription.unsubscribe();
      customersSubscription.unsubscribe();
      userRolesSubscription.unsubscribe();
    };
  }, [enabled, queryClient]);

  return {
    // Utility function to manually trigger data refresh
    refreshAllData: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  };
};
