import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://asianshealthcare.com";

  const staticPages = [
    { url: baseUrl, changeFrequency: "weekly" as const, priority: 1 },
    "/about-us", "/doctors", "/hospitals", "/treatment-package",
    "/speciality", "/contact-us", "/testimonials", "/blogs",
    "/insurance-company", "/hotels", "/tourism",
  ].map((page) => ({
    url: `${baseUrl}${page === baseUrl ? "" : page}`,
    lastModified: new Date(),
    changeFrequency: (page === baseUrl ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: page === baseUrl ? 1 : 0.8,
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data: blogs } = await supabase.from("blogs").select("slug, updated_at, published_at").eq("is_published", true);
    blogPages = (blogs || []).map((b) => ({
      url: `${baseUrl}/blogs/${b.slug}`,
      lastModified: new Date(b.updated_at || b.published_at || new Date()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch {
    // Blog table may not exist yet — skip dynamic entries
  }

  return [...staticPages, ...blogPages];
}
