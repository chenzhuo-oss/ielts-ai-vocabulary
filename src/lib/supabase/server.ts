import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serverClient: SupabaseClient | undefined;

export function getSupabaseServerClient() {
  if (serverClient) return serverClient;

  const supabaseUrl = process.env.SUPABASE_URL?.trim();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim();

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error("SUPABASE_SERVER_CONFIG_MISSING");
  }

  serverClient = createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  return serverClient;
}
