import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mergeSiteImages, SITE_IMAGE_KEYS } from "@/lib/site-images";

export async function getSiteImages() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("site_settings").select("key, value").in("key", SITE_IMAGE_KEYS);
  return mergeSiteImages(data || undefined);
}
