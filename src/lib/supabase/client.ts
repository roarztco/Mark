import { createBrowserClient } from "@supabase/ssr";
import { supabaseConfig } from "./env";
import type { Database } from "../../types/supabase";

export const supabase = createBrowserClient<Database>(supabaseConfig.url, supabaseConfig.publishableKey, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
