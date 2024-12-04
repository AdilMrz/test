import { supabaseClient } from "../supabase";

export const logAction = async (
  user_email: string,
  action: string,
  details: string,
) => {
  try {
    await supabaseClient.from("logs").insert({
      user_email,
      action,
      details,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error logging action:", error);
  }
};
