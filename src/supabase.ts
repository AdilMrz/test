import { createClient } from "@supabase/supabase-js";
import { supabaseDataProvider, supabaseAuthProvider } from "ra-supabase";
import { AUTHORIZED_EMAILS } from "./auth";

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const dataProvider = supabaseDataProvider({
  instanceUrl: import.meta.env.VITE_SUPABASE_URL,
  apiKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  supabaseClient,
});

const baseAuthProvider = supabaseAuthProvider(supabaseClient, {
  getPermissions: async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error || !user) return null;
    return AUTHORIZED_EMAILS.includes(user.email || "") ? "admin" : "user";
  },
});

export const authProvider = {
  ...baseAuthProvider,
  login: async (params: { email: string; password: string }) => {
    if (!AUTHORIZED_EMAILS.includes(params.email)) {
      return Promise.reject("Email non autorisé");
    }
    return baseAuthProvider.login(params);
  },
  checkAuth: async () => {
    const {
      data: { user },
      error,
    } = await supabaseClient.auth.getUser();
    if (error || !user) {
      return Promise.reject();
    }
    if (!AUTHORIZED_EMAILS.includes(user.email || "")) {
      return Promise.reject("Email non autorisé");
    }
    return Promise.resolve();
  },
  checkError: async (error: { status?: number }) => {
    if (error?.status === 401 || error?.status === 403) {
      await supabaseClient.auth.signOut();
      return Promise.reject();
    }
    return Promise.resolve();
  },
};
