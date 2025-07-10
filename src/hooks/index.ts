// React Query hooks for enhanced data management
export { useDashboardData } from "./useDashboardData";
export { useRealtimeData } from "./useRealtimeData";
export {
  useUserData,
  useUserDataById,
  useInvalidateUserData,
  usePrefetchUserData,
} from "./useUserData";
export {
  useCustomers,
  useCustomer,
  useCreateCustomer,
  useUpdateCustomer,
  useDeleteCustomer,
  useBulkDeleteCustomers,
  usePrefetchCustomer,
} from "./useCustomers";

// Other hooks
export { useErrorHandler } from "./useErrorHandler";
