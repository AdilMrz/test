import { QueryClient } from "@tanstack/react-query";

export const queryClientConfig = {
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30000,
    },
    mutations: {
      retry: 1,
    },
  },
};

export const queryClient = new QueryClient(queryClientConfig);
