import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Blog Post",
  description: "Read our detailed guide on medical tourism in India.",
};

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: post } = await supabase.from("blogs").select("*").eq("slug", params.slug).single();

  if (!post) notFound();

  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "";

  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/blogs" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Blogs
          </Link>
          <span className="pill-tag mb-4">{post.category}</span>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4 max-w-4xl">{post.title}</h1>
          <div className="flex items-center gap-4 text-caption text-link-cool-2">
            <span className="flex items-center gap-1"><User size={14} />{post.author || "Asians Team"}</span>
            <span className="flex items-center gap-1"><Calendar size={14} />{date}</span>
          </div>
        </div>
      </section>

      <article className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            {post.thumbnail_url && (
              <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-lg border border-hairline-light">
                <Image src={post.thumbnail_url} alt={post.title} fill className="object-cover" />
              </div>
            )}
            <div className="text-body-lg text-shade-50 leading-relaxed space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </article>
    </>
  );
}
