import type { Metadata } from "next";
import { fallbackDoctors } from "@/lib/fallback-data";
import PageHero from "@/components/layout/PageHero";
import SearchInput from "@/components/layout/SearchInput";
import { JsonLd } from "@/components/shared/JsonLd";
import { breadcrumbSchema } from "@/lib/json-ld";
import { getSiteImages } from "@/lib/site-settings";
import BreadcrumbNav from "@/components/shared/BreadcrumbNav";
import DoctorsGrid from "@/components/shared/DoctorsGrid";

export const metadata: Metadata = {
  title: "Top Specialist Doctors in India - Apollo Hospitals Network",
  description: "Browse 3000+ specialist doctors from Apollo Hospitals network across India. Find cardiologists, orthopedicians, neurologists, oncologists and more.",
  alternates: { canonical: "https://asianshealthcare.com/doctors" },
};

export default async function DoctorsPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string }>;
}) {
  const sp = searchParams ? await searchParams : {};
  const images = await getSiteImages();
  const query = typeof sp?.q === "string" ? sp.q.trim() : "";
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
          <DoctorsGrid doctors={doctors} />
        </div>
      </section>
    </>
  );
}
