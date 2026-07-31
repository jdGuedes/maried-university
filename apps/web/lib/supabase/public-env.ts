type SupabasePublicEnv = {
  url: string;
  publishableKey: string;
};

const SUPABASE_URL_KEY = "NEXT_PUBLIC_SUPABASE_URL";
const SUPABASE_KEY_KEY = "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY";

export function getSupabasePublicEnv(): SupabasePublicEnv {
  const url = process.env[SUPABASE_URL_KEY];
  const publishableKey = process.env[SUPABASE_KEY_KEY];

  if (!url || !publishableKey) {
    throw new Error("Supabase public environment is not configured.");
  }

  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    throw new Error("Supabase URL must be an absolute HTTP(S) URL.");
  }

  return { url, publishableKey };
}

export function hasSupabasePublicEnv() {
  return Boolean(process.env[SUPABASE_URL_KEY] && process.env[SUPABASE_KEY_KEY]);
}

export const supabasePublicEnvKeys = {
  url: SUPABASE_URL_KEY,
  publishableKey: SUPABASE_KEY_KEY
} as const;
