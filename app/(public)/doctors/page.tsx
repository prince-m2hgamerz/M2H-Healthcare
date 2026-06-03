import type { Metadata } from "next";
import Link from "next/link";
import { Star, Search, Building2, Stethoscope } from "lucide-react";
import Image from "next/image";
import { fallbackDoctors } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/site-settings";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Top Specialist Doctors in India - Apollo Hospitals Network",
  description: "Browse 3000+ specialist doctors from Apollo Hospitals network across India. Find cardiologists, orthopedicians, neurologists, oncologists and more.",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const images = await getSiteImages();
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  const allDoctors = fallbackDoctors;
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

      <section className="bg-canvas-cream py-10 sm:py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search doctors by name, specialty, or hospital..."
            label="Search doctors"
            resultCount={doctors.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-12 sm:py-huge">
        <div className="container-cinematic">
          {doctors.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-xl p-8 sm:p-12 bg-canvas-cream">
              <Search size={48} className="mx-auto mb-4 text-shade-30" />
              <h2 className="font-display text-heading-md sm:text-heading-lg text-ink">No doctors found</h2>
              <p className="text-body-md text-shade-50 mt-2 max-w-md mx-auto">Try a different specialty, doctor name, or hospital.</p>
              <Link href="/doctors" className="btn-primary mt-6 inline-flex items-center gap-2">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
              {doctors.map((doctor) => (
                <Link
                  key={doctor.slug}
                  href={`/doctors/${doctor.slug}`}
                  className="group bg-canvas-light rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10">
                    {doctor.photo_url ? (
                      <Image
                        src={doctor.photo_url}
                        alt={doctor.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-aloe-10 to-pistachio-10">
                        <span className="text-4xl sm:text-5xl font-bold text-aloe-30/50 select-none">
                          {getInitials(doctor.name)}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-medium text-ink shadow-sm">
                        <Star size={11} className="fill-yellow-400 text-yellow-400" />
                        {doctor.rating}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-medium text-ink shadow-sm truncate">
                        <Building2 size={11} className="text-shade-40 shrink-0" />
                        <span className="truncate">{doctor.hospital}</span>
                      </span>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
                    <div>
                      <h2 className="font-display text-sm sm:text-base text-ink group-hover:text-shade-60 transition-colors line-clamp-1 font-semibold">
                        {doctor.name}
                      </h2>
                      <p className="text-xs sm:text-sm text-shade-50 mt-0.5 line-clamp-1 flex items-center gap-1">
                        <Stethoscope size={12} className="shrink-0 text-shade-40" />
                        {doctor.specialty}
                      </p>
                    </div>
                    <div className="mt-auto pt-1.5">
                      <span className="block w-full text-center text-xs sm:text-sm font-medium text-on-primary bg-aloe-40 hover:bg-aloe-50 rounded-lg px-3 py-2.5 sm:py-3 transition-colors">
                        Book Appointment
                      </span>
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
