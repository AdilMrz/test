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

    console.log("🔄 Setting up real-time subscriptions...");

    // Products real-time subscription
    const productsSubscription = supabaseClient
      .channel("products-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "products" },
        (payload: RealtimePostgresChangesPayload<Product>) => {
          // Type guard to ensure we have a valid Product object
          const newProduct = payload.new as Product | null;
          const oldProduct = payload.old as Product | null;

          const productName = newProduct?.name || oldProduct?.name;
          const productId = newProduct?.id || oldProduct?.id;

          console.log("📦 Products changed:", payload.eventType, productName);

          // Invalidate all product-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "products"],
          });
          queryClient.invalidateQueries({ queryKey: ["products"] });

          // If it's a specific product update, invalidate that specific query too
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
          // Type guard to ensure we have a valid Purchase object
          const newPurchase = payload.new as Purchase | null;
          const oldPurchase = payload.old as Purchase | null;

          const purchaseId = newPurchase?.id || oldPurchase?.id;

          console.log("🛒 Purchases changed:", payload.eventType, purchaseId);

          // Invalidate all purchase-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "purchases"],
          });
          queryClient.invalidateQueries({ queryKey: ["purchases"] });

          // If it's a specific purchase update, invalidate that specific query too
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
          // Type guard to ensure we have a valid Customer object
          const newCustomer = payload.new as Customer | null;
          const oldCustomer = payload.old as Customer | null;

          const customerName = newCustomer?.fullname || oldCustomer?.fullname;
          const customerId = newCustomer?.id || oldCustomer?.id;

          console.log("👥 Customers changed:", payload.eventType, customerName);

          // Invalidate all customer-related queries
          queryClient.invalidateQueries({
            queryKey: ["dashboard", "customers"],
          });
          queryClient.invalidateQueries({ queryKey: ["customers"] });

          // If it's a specific customer update, invalidate that specific query too
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
          // Type guard to ensure we have a valid UserRole object
          const newUserRole = payload.new as UserRole | null;
          const oldUserRole = payload.old as UserRole | null;

          const userId = newUserRole?.user_id || oldUserRole?.user_id;

          console.log("👤 User roles changed:", payload.eventType, userId);

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
      console.log("🔌 Cleaning up real-time subscriptions...");
      productsSubscription.unsubscribe();
      purchasesSubscription.unsubscribe();
      customersSubscription.unsubscribe();
      userRolesSubscription.unsubscribe();
    };
  }, [enabled, queryClient]);

  return {
    // Utility function to manually trigger data refresh
    refreshAllData: () => {
      console.log("🔄 Manually refreshing all data...");
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  };
};
