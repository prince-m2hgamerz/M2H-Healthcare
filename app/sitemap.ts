import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.M2H_PUBLIC_SITE_URL || "https://asianshealthcare.com";

  const staticPages = [
    "", "/about-us", "/doctors", "/hospitals", "/treatment-package",
    "/speciality", "/contact-us", "/testimonials", "/blogs",
    "/insurance-company", "/hotels", "/tourism",
  ];

  return staticPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8,
  }));
}
