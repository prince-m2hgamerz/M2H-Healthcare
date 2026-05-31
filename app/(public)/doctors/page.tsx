import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackDoctors } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/site-settings";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Top Specialist Doctors in India",
  description: "Browse India's top specialist doctors across cardiology, orthopedics, oncology, neurology, and more. Board-certified surgeons at JCI hospitals in Delhi NCR.",
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("doctors").select("*").limit(50),
    getSiteImages(),
  ]);
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const fetchedDoctors = raw?.map((doctor) => {
    const fallback = fallbackDoctors.find((fb) => fb.slug === doctor.slug);
    return {
      name: doctor.name,
      specialty: doctor.specialties?.[0] || fallback?.specialty || "Specialist",
      hospital: fallback?.hospital || "",
      experience: `${doctor.experience_years || fallback?.experience_years || 0} years`,
      slug: doctor.slug,
      rating: 4.9,
      photo_url: fallback?.photo_url || doctor.photo_url || "https://satyughealthcare.com/uploads/doctors/a330cd2834d5826c649d5295bc0cfae7.jpg",
    };
  }) || [];

  const allDoctors = fetchedDoctors.length > 0 ? fetchedDoctors : fallbackDoctors;
  const doctors = normalizedQuery
    ? allDoctors.filter((doctor) =>
        [doctor.name, doctor.specialty, doctor.hospital, doctor.experience]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allDoctors;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Doctors", url: "https://asianshealthcare.com/doctors" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Doctors", href: "/doctors" },
      ]} />
      <PageHero
        eyebrow="Our Experts"
        title="Our Specialist Doctors"
        description="India's finest medical professionals with decades of experience and international recognition."
        imageUrl={images.image_doctors_hero}
      />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search doctors by name, specialty, or hospital..."
            label="Search doctors"
            resultCount={doctors.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {doctors.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No doctors found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different specialty, doctor name, or hospital.</p>
              <Link href="/doctors" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctors.map((doctor) => (
                <Link key={doctor.slug} href={`/doctors/${doctor.slug}`} className="group bg-canvas-light rounded-lg border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300">
                  <div className="relative h-56 overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10">
                    <Image
                      src={doctor.photo_url}
                      alt={doctor.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 text-center">
                    <h2 className="font-display text-heading-md text-ink group-hover:text-shade-60 transition-colors">{doctor.name}</h2>
                    <p className="text-body-md text-shade-50 mt-1">{doctor.specialty}</p>
                    <p className="text-caption text-shade-40 mt-2">
                      {doctor.hospital ? `${doctor.experience} - ${doctor.hospital}` : doctor.experience}
                    </p>
                    <p className="inline-flex items-center justify-center gap-1 text-micro text-yellow-500 mt-2">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {doctor.rating}
                    </p>
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
