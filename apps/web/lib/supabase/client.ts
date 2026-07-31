import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "./database.types";
import { getSupabasePublicEnv } from "./public-env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getSupabasePublicEnv();

  return createBrowserClient<Database>(url, publishableKey);
}
