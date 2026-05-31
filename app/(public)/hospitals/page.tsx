import type { Metadata } from "next";
import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { fallbackHospitals } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/site-settings";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";

export const metadata: Metadata = {
  title: "Partner Hospitals in India",
  description: "Explore India's top JCI and NABH accredited hospitals for medical tourism. Apollo, Max, Artemis, BLK-Max, Sir Ganga Ram & more in Delhi NCR.",
};

export default async function HospitalsPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("hospitals").select("*").limit(50),
    getSiteImages(),
  ]);
  const query = typeof searchParams?.q === "string" ? searchParams.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  // Real hospital building images mapped by slug
  const hospitalImages: Record<string, string> = {
    "aiims-delhi": "https://upload.wikimedia.org/wikipedia/commons/c/cd/AIIMS_-New_Delhi%27s_Ward_Block.jpg",
    "medanta-the-medicity": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/January2024/rRYbW6Ah4XKY0c6se2UgwXkV4p6NXb-metaR1VSVUdSQU0ucG5n-.png",
    "apollo-hospitals-delhi": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Indraprastha_Apollo_Hospital.jpg",
    "fortis-escorts-heart-institute": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Fortis_Hospital_Noida_-_panoramio.jpg",
    "max-super-speciality-hospital-saket": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/September2023/7SQ9q1Q1OCZRgZRErb64rLCNhnUGSi-metabHVja25vdy5qcGc=-.jpg",
    "sir-ganga-ram-hospital": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/February2025/YelIyqoA5uGHAsU26kWk9EH54Aumyv-metaUGF0bmEgSG9zcGl0YWwgSW1hZ2UgKDIpLmpwZw==-.jpg",
    "blk-max-super-speciality-hospital": "https://upload.wikimedia.org/wikipedia/commons/3/32/BLK_Super_Specialty_Hospital.jpg",
    "artemis-hospital-gurugram": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/April2025/sdE5SGg6gM0Y4fqeIaLSlnZO7bE8Rq-metaSW5kb3JlIGhvc3BpdGFsIDEuanBn-.jpg",
    "fortis-memorial-research-institute": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Fortis_Hospital_Noida_-_panoramio.jpg",
    "manipal-hospital-dwarka": "https://upload.wikimedia.org/wikipedia/commons/4/47/Manipal_hospital.jpg",
    "indian-spinal-injuries-centre": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/January2024/UG8G445YMpH2rBUJCF8zJlK52TbUFG-metaSW5kb3JlLnBuZw==-.png",
    "venkateshwar-hospital": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/September2025/tueLPci3oHXKmxX7Uz2mnvpMD4M6PE-metaNDgwX3hfMzIwLndlYnA=-.webp",
    "saroj-super-speciality-hospital": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/April2025/W745nIg3xEkkTksRkH6pFvEAgCyo7D-metaRjdnUkJWYWNqVU1qM1lTaHllazBwZTVHV0lxUDJDLW1ldGFVbUZ1WTJocElEVXhOQ0FnZUNBME1EQXVjRzVuLS5wbmc=-.png",
    "paras-hospital-gurugram": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/February2025/KRKHMv9Fxr54fLXKN0OjZzxiiwFTBq-metaT2JSZkdhUTI1bnJwWldCdkJKMWxzdHBCVG91cEdNLW1ldGFSM1Z5ZFdkeVlXMHVhbkJuLS5qcGc=-.jpg",
    "narayana-superspeciality-hospital-gurugram": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Narayana_Multispeciality_Hospital%2C_Mysore.jpg",
    "moolchand-hospital": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/September2023/7SQ9q1Q1OCZRgZRErb64rLCNhnUGSi-metabHVja25vdy5qcGc=-.jpg",
    "columbia-asia-hospital-gurugram": "https://medanta.s3.ap-south-1.amazonaws.com/hospitals/January2024/vv3jGl55XyYhdw6Css4eETU7I3cSty-metaTHVja25vdy5wbmc=-.png",
  };

  const fetchedHospitals = raw?.map((hospital) => ({
    name: hospital.name,
    location: `${hospital.city}, ${hospital.state}`,
    city: hospital.city,
    state: hospital.state,
    beds: `${hospital.beds_count?.toLocaleString() || 0}+`,
    accreditation: hospital.accreditations?.join(", ") || "Accredited",
    slug: hospital.slug,
    photo_url: hospitalImages[hospital.slug] || hospital.logo_url || "https://upload.wikimedia.org/wikipedia/commons/e/e8/Indraprastha_Apollo_Hospital.jpg",
  })) || [];

  const allHospitals = fetchedHospitals.length > 0 ? fetchedHospitals : fallbackHospitals;
  const hospitals = normalizedQuery
    ? allHospitals.filter((hospital) =>
        [hospital.name, hospital.location, hospital.accreditation]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : allHospitals;

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Hospitals", url: "https://asianshealthcare.com/hospitals" },
      ])} />
      <BreadcrumbNav items={[
        { label: "Home", href: "/" },
        { label: "Hospitals", href: "/hospitals" },
      ]} />
      <PageHero
        eyebrow="Top Facilities"
        title="Our Partner Hospitals"
        description="Internationally accredited hospitals equipped with advanced technology and world-class infrastructure."
        imageUrl={images.image_hospitals_hero}
      />

      <section className="bg-canvas-cream py-12 border-b border-hairline-light">
        <div className="container-cinematic">
          <SearchInput
            placeholder="Search hospitals by city or name..."
            label="Search hospitals"
            resultCount={hospitals.length}
          />
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          {hospitals.length === 0 ? (
            <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
              <h2 className="font-display text-heading-lg text-ink">No hospitals found</h2>
              <p className="text-body-md text-shade-50 mt-2">Try a different hospital name, city, or accreditation.</p>
              <Link href="/hospitals" className="btn-primary mt-6">
                Clear Search
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hospitals.map((hospital) => (
                <Link key={hospital.slug} href={`/hospitals/${hospital.slug}`} className="group bg-canvas-light rounded-lg border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={hospital.photo_url}
                      alt={hospital.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="pill-tag !text-micro !px-2 !py-0.5">{hospital.accreditation}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h2 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{hospital.name}</h2>
                    <div className="flex items-center gap-1 text-caption text-shade-40 mt-1">
                      <MapPin size={14} /><span>{hospital.location}</span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-caption text-shade-50">
                      <Building2 size={14} /> <span>{hospital.beds} beds</span>
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
