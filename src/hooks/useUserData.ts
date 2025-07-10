import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabaseClient } from "../supabase";

interface UserData {
  user: { id: string; email?: string };
  role: string;
  fullname?: string;
  email?: string;
}

export const useUserData = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: async (): Promise<UserData> => {
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();

      if (!user) {
        throw new Error("No authenticated user found");
      }

      const { data: userRole, error } = await supabaseClient
        .from("user_role")
        .select("role, fullname")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        // Don't throw here, just use default role
      }

      return {
        user: { id: user.id, email: user.email },
        role: userRole?.role || "user",
        fullname: userRole?.fullname,
        email: user.email,
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      // Don't retry if user is not authenticated
      if (
        error instanceof Error &&
        error.message.includes("No authenticated user")
      ) {
        return false;
      }
      return failureCount < 2;
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook for getting user data with specific user ID (useful for admin operations)
export const useUserDataById = (userId: string, enabled = true) => {
  return useQuery({
    queryKey: ["user", "profile", userId],
    queryFn: async (): Promise<Partial<UserData>> => {
      const { data: userRole, error } = await supabaseClient
        .from("user_role")
        .select("role, fullname, user_id")
        .eq("user_id", userId)
        .single();

      if (error) {
        throw error;
      }

      return {
        user: { id: userId },
        role: userRole?.role || "user",
        fullname: userRole?.fullname,
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });
};

// Hook for invalidating user data (useful after role changes)
export const useInvalidateUserData = () => {
  const queryClient = useQueryClient();

  return {
    invalidateCurrentUser: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile"] });
    },
    invalidateUserById: (userId: string) => {
      queryClient.invalidateQueries({ queryKey: ["user", "profile", userId] });
    },
    invalidateAllUsers: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  };
};

// Hook for prefetching user data (useful for admin interfaces)
export const usePrefetchUserData = () => {
  const queryClient = useQueryClient();

  return {
    prefetchUserData: async (userId: string) => {
      await queryClient.prefetchQuery({
        queryKey: ["user", "profile", userId],
        queryFn: async (): Promise<Partial<UserData>> => {
          const { data: userRole, error } = await supabaseClient
            .from("user_role")
            .select("role, fullname, user_id")
            .eq("user_id", userId)
            .single();

          if (error) {
            throw error;
          }

          return {
            user: { id: userId },
            role: userRole?.role || "user",
            fullname: userRole?.fullname,
          };
        },
        staleTime: 5 * 60 * 1000,
      });
    },
  };
};
