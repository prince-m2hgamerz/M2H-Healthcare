import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, DollarSign } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fallbackTreatments } from "@/lib/fallback-data";
import { getSiteImages } from "@/lib/site-settings";
import { getTreatmentImage } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Treatment Package Details",
  description: "View detailed treatment information and costs in India.",
};

export default async function TreatmentDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient();
  const [{ data: rawTreatment }, images] = await Promise.all([
    supabase.from("treatments").select("*").eq("slug", params.slug).single(),
    getSiteImages(),
  ]);
  const fallbackTreatment = fallbackTreatments.find((treatment) => treatment.slug === params.slug);
  const treatment = rawTreatment
      ? {
          name: rawTreatment.name,
          category: rawTreatment.category,
          costMin: Number(rawTreatment.cost_usd_min) || 0,
          costMax: Number(rawTreatment.cost_usd_max) || 0,
          description: rawTreatment.description || "No description available.",
        }
    : fallbackTreatment;

  if (!treatment) notFound();

  const usCost = "usCost" in treatment ? treatment.usCost : treatment.costMax * 5 || 10000;

  return (
    <>
      <section className="relative overflow-hidden bg-canvas-night text-on-primary py-20">
        <div className="absolute inset-0">
          <Image
            src={getTreatmentImage(images, params.slug, treatment.category)}
            alt=""
            fill
            priority
            className="object-cover opacity-25"
          />
        </div>
        <div className="absolute inset-0 bg-canvas-night/80" />
        <div className="container-cinematic relative z-10">
          <Link href="/treatment-package" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Treatments
          </Link>
          <span className="pill-tag mb-4">{treatment.category}</span>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">{treatment.name}</h1>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-display text-display-md text-aloe-10">${treatment.costMin.toLocaleString()}</span>
            <span className="text-body-lg text-link-cool-2">- ${treatment.costMax.toLocaleString()}</span>
          </div>
          <p className="text-caption text-link-cool-1 mb-4">In India</p>
          <div className="inline-flex items-center gap-2 bg-aloe-10/15 text-aloe-10 rounded-pill px-4 py-2 mt-4">
            <DollarSign size={18} className="text-aloe-10" />
            <span className="text-body-md">Typical overseas comparison: ${usCost.toLocaleString()}</span>
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-4">About This Treatment</h2>
            <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{treatment.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">3-5 days</div>
                <p className="text-caption text-shade-50 mt-1">Hospital Stay</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">6-8 weeks</div>
                <p className="text-caption text-shade-50 mt-1">Recovery Time</p>
              </div>
              <div className="bg-canvas-cream rounded-lg p-6 text-center border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-0.5 transition-all duration-300">
                <div className="font-display text-heading-xl text-ink">95%</div>
                <p className="text-caption text-shade-50 mt-1">Success Rate</p>
              </div>
            </div>

            <h3 className="font-display text-heading-lg text-ink mb-4">Typical Coordination</h3>
            <ul className="space-y-3 mb-8">
              {["Specialist opinion", "Hospital estimate", "Visa invitation support", "Admission coordination", "Interpreter support", "Discharge and follow-up guidance"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-shade-50">
                  <Check size={18} className="text-aloe-10 shrink-0" /> {item}
                </li>
              ))}
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact-us" className="btn-primary">Get Treatment Plan</Link>
              <Link href="/doctors" className="btn-outline">Find a Specialist</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
