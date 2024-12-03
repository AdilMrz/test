export const AUTHORIZED_EMAILS = [
  "adil.mrz.1987@gmail.com",
  "jules.dupk@gmail.com",
];

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
