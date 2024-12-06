import { createClient } from "@supabase/supabase-js";
import { supabaseDataProvider, supabaseAuthProvider } from "ra-supabase";

export const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const dataProvider = supabaseDataProvider({
  instanceUrl: import.meta.env.VITE_SUPABASE_URL,
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  supabaseClient,
});

export const authProvider = supabaseAuthProvider(supabaseClient, {
  getIdentity: async () => {
    const {
      data: { user },
    } = await supabaseClient.auth.getUser();
    if (!user) throw new Error("No user found");

    const { data: userRole, error } = await supabaseClient
      .from("user_role")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching user role:", error);
    }

    const role = userRole?.role || "user";

    return {
      id: user.id,
      fullName: user.email,
      email: user.email,
      role,
    };
  },
});
