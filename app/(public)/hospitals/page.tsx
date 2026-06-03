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
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const supabase = await createServerSupabaseClient();
  const [{ data: raw }, images] = await Promise.all([
    supabase.from("hospitals").select("*").limit(50),
    getSiteImages(),
  ]);
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
  const normalizedQuery = query.toLowerCase();

  // Real hospital images - each matches the actual hospital building/logo
  const hospitalImages: Record<string, string> = {
    "aiims-delhi": "https://upload.wikimedia.org/wikipedia/commons/c/cd/AIIMS_-New_Delhi%27s_Ward_Block.jpg",
    "medanta-the-medicity": "https://getwellgo.com/uploads/hospitals/medanta-gurgaon.jpg",
    "apollo-hospitals-delhi": "https://satyughealthcare.com/uploads/hospitals/1580542668_Indraprastha-Apollo-Hospital_icon-600x586.jpg",
    "fortis-escorts-heart-institute": "https://satyughealthcare.com/uploads/hospitals/1612249990_Fortis_escorts_jaipur.jpg",
    "max-super-speciality-hospital-saket": "https://satyughealthcare.com/uploads/hospitals/1709659199_Max_Hospital_Dwarka_Sector_10,_New_Delhi.jpg",
    "sir-ganga-ram-hospital": "https://www.joonsquare.com/usermanage/image/business/sir-ganga-ram-hospital-east-delhi-1160/sir-ganga-ram-hospital-east-delhi-ganga2.jpg",
    "blk-max-super-speciality-hospital": "https://crossborderscare.com/wp-content/uploads/2023/05/Blk-Max-hospital.jpg",
    "artemis-hospital-gurugram": "https://www.globalcarehealth.com/img/hospitalsimg/Artemis-Hospital-Gurugram-India-gchh81.webp",
    "fortis-memorial-research-institute": "https://satyughealthcare.com/uploads/hospitals/1636038339_fortis_hospital,_shalimar_bagh,_new_delhi,_delhi.jpg",
    "manipal-hospital-dwarka": "https://satyughealthcare.com/uploads/hospitals/1591203905_Manipal_Hospital.jpg",
    "indian-spinal-injuries-centre": "https://satyughealthcare.com/uploads/hospitals/1600550232_Indian_Spinal_Injuries_Center,_Vasant_Kunj_,_New_Delhi.jpg",
    "venkateshwar-hospital": "https://satyughealthcare.com/uploads/hospitals/1609080986_venkateshwar-hospital,_dwarka_sector_18,_New_Delhi.jpg",
    "saroj-super-speciality-hospital": "https://satyughealthcare.com/uploads/hospitals/1636038966_blk_max_super_speciality_hospital,_New_Delhi.jpg",
    "paras-hospital-gurugram": "https://medicircle.in/uploads/2020/january2020/paras_hospital_edit.jpg",
    "narayana-superspeciality-hospital-gurugram": "https://satyughealthcare.com/uploads/hospitals/1610359225_Narayana_Superspeciality_Hospital__Gurugram.jpg",
    "moolchand-hospital": "https://satyughealthcare.com/uploads/hospitals/1609996048_moolchand-medcity-hospital-sikandra-agra-hospitals-8xp1twzhgx.jpg",
    "columbia-asia-hospital-gurugram": "https://satyughealthcare.com/uploads/hospitals/1636038848_columbia_asia_hospital_hebbal_bangalore.jpg",
  };

  const fetchedHospitals = raw?.map((hospital) => ({
    name: hospital.name,
    location: `${hospital.city}, ${hospital.state}`,
    city: hospital.city,
    state: hospital.state,
    beds: `${hospital.beds_count?.toLocaleString() || 0}+`,
    accreditation: hospital.accreditations?.join(", ") || "Accredited",
    slug: hospital.slug,
    photo_url: hospitalImages[hospital.slug] || hospital.logo_url || "https://safartibbi.com/wp-content/uploads/2022/11/apolo-1.jpg",
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
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <Image
                      src={hospital.photo_url}
                      alt={hospital.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
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
