import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Check } from "lucide-react";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Insurance Details",
  description: "View insurance coverage details for treatment in India.",
};

export default async function InsuranceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: insurance } = await supabase.from("insurance_companies").select("*").eq("slug", slug).single();

  if (!insurance) notFound();

  return (
    <>
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/insurance-company" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} /> Back to Insurance Partners
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-aloe-10 flex items-center justify-center">
              <Shield size={28} className="text-ink" />
            </div>
            <span className="pill-tag">Insurance Partner</span>
          </div>
          <h1 className="font-display text-[42px] leading-tight sm:text-display-xl lg:text-display-lg text-on-primary mb-4">{insurance.name}</h1>
          <p className="text-body-lg text-link-cool-2 max-w-2xl">
            {insurance.description || "We accept insurance from this provider for medical treatments in India."}
          </p>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-6">Coverage Benefits</h2>
            <ul className="space-y-4 mb-8">
              {["In-patient treatment coverage", "Pre-authorization assistance", "Direct billing with partner hospitals", "Emergency medical evacuation", "Post-treatment follow-up"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-body-md text-shade-50">
                  <Check size={18} className="text-aloe-10 shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <Link href="/contact-us" className="btn-primary">Check Your Eligibility</Link>
          </div>
        </div>
      </section>
    </>
  );
}
