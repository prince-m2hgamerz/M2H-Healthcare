import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import PageHero from "@/components/layout/PageHero";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { fallbackBlogs } from "@/lib/fallback-data";
import { getSiteImages } from "@/lib/site-settings";

export const metadata: Metadata = {
  title: "Medical Tourism Blog & Guides",
  description: "Expert guides on medical tourism in India. Treatment costs, hospital comparisons, visa tips, recovery planning, and patient stories from Delhi NCR.",
  alternates: { canonical: "/blogs" },
};

const categories = ["All", "Medical Visa Guide", "Treatment Blog", "Tourism Blog"];

export default async function BlogsPage() {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("blogs").select("*").eq("is_published", true).limit(20),
    getSiteImages(),
  ]);
  const fetchedBlogs = raw?.map((b) => ({
    title: b.title,
    category: b.category,
    author: b.author || "Asians Team",
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    slug: b.slug,
    excerpt: b.content?.substring(0, 120) + "..." || "",
    thumbnail_url: b.thumbnail_url || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=800&q=80",
  })) || [];
  const blogs = fetchedBlogs.length > 0 ? fetchedBlogs : fallbackBlogs.map((b) => ({
    ...b,
    date: b.published_at ? new Date(b.published_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "",
    excerpt: b.content?.substring(0, 120) + "..." || "",
  }));

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Blog", url: "https://asianshealthcare.com/blogs" },
      ])} />
      <PageHero
        eyebrow="Our Blog"
        title="Blogs & Resources"
        description="Stay informed with the latest in medical tourism, treatment guides, and healthcare tips."
        imageUrl={images.image_blogs_hero}
      />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <div className="flex flex-wrap gap-3">
            {categories.map((cat) => (
              <button key={cat} className={`px-5 py-2 rounded-pill text-body-md transition-colors ${cat === "All" ? "bg-ink text-on-primary" : "bg-shade-30 text-ink hover:bg-shade-40"}`}>{cat}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.slug} href={`/blogs/${blog.slug}`} className="group bg-canvas-cream rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10">
                  <Image
                    src={blog.thumbnail_url}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <span className="pill-tag-shade !text-micro !px-2 !py-0.5 mb-3 bg-aloe-10/80">{blog.category}</span>
                  <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors mb-3">{blog.title}</h2>
                  <p className="text-body-md text-shade-50 mb-4 line-clamp-2">{blog.excerpt}</p>
                  <div className="flex items-center gap-4 text-caption text-shade-40">
                    <span className="flex items-center gap-1"><User size={14} />{blog.author}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} />{blog.date}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
