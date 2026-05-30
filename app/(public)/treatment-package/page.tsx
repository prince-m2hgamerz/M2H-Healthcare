import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackTreatments } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/site-settings";
import { getTreatmentImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Affordable Medical Treatment Costs in India",
  description: "Compare treatment costs in India vs. US/UK. Save 60-80% on cardiology, orthopedics, oncology, IVF, and more at top JCI hospitals in Delhi NCR.",
};

export default async function TreatmentPackagesPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("treatments").select("*").limit(50),
    getSiteImages(),
  ]);
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const fetchedTreatments = raw?.map((treatment) => ({
    name: treatment.name,
    costMin: Number(treatment.cost_usd_min) || 0,
    costMax: Number(treatment.cost_usd_max) || 0,
    usCost: Number(treatment.cost_usd_max) * 5 || 10000,
    slug: treatment.slug,
    category: treatment.category || "General",
    description: treatment.description || "",
  })) || [];

  const allTreatments = fetchedTreatments.length > 0 ? fetchedTreatments : fallbackTreatments;
  const treatments = normalizedQuery
    ? allTreatments.filter((treatment) =>
        [treatment.name, treatment.category, treatment.description]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allTreatments;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Treatment Packages", url: "https://asianshealthcare.com/treatment-package" },
      ])} />
      <PageHero
        eyebrow="Affordable Care"
        title="Treatment Packages & Costs"
        description="Compare treatment costs in India vs. Western countries. Save 60-80% without compromising on quality."
        imageUrl={images.image_treatments_hero}
      />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search treatments by name or category..."
            label="Search treatments"
            resultCount={treatments.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {treatments.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No treatments found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different procedure, specialty, or category.</p>
              <Link href="/treatment-package" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {treatments.map((treatment) => (
                <Link key={treatment.slug} href={`/treatment-package/${treatment.slug}`} className="group overflow-hidden bg-canvas-cream rounded-lg border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
                  <div className="relative h-44">
                    <Image
                      src={getTreatmentImage(images, treatment.slug, treatment.category)}
                      alt={treatment.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <span className="pill-tag-shade !text-micro !px-2 !py-0.5 mb-3 bg-aloe-10/80">{treatment.category}</span>
                    <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{treatment.name}</h2>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="font-display text-display-md text-ink">${treatment.costMin.toLocaleString()}</span>
                      <span className="text-body-md text-shade-40">- ${treatment.costMax.toLocaleString()}</span>
                    </div>
                    <p className="text-caption text-shade-40 mt-1">In India</p>
                    <div className="mt-3 pt-3 border-t border-hairline-light">
                      <p className="text-caption text-shade-50">US Cost: <span className="text-shade-60 line-through">${treatment.usCost.toLocaleString()}</span></p>
                    </div>
                    <div className="mt-4 flex items-center text-sm text-ink font-medium group-hover:gap-3 transition-all">
                      View Details <ArrowRight size={16} className="ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
