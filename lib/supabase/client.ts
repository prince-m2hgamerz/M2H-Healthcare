import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.M2H_PUBLIC_SUPABASE_URL!,
    process.env.M2H_PUBLIC_SUPABASE_ANON_KEY!
  );
}
