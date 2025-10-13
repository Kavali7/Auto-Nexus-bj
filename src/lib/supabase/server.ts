import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const getSupabaseAdmin = () => {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Supabase service role missing (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
