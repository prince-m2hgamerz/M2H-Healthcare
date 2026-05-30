import { createServerSupabaseClient } from "@/lib/supabase/server";
import { JsonLd } from "@/components/shared/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/json-ld";
import HeroSection from "@/components/home/HeroSection";
import StatsCounter from "@/components/home/StatsCounter";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import PatientSupportServices from "@/components/home/PatientSupportServices";
import FeaturedDoctors from "@/components/home/FeaturedDoctors";
import FeaturedHospitals from "@/components/home/FeaturedHospitals";
import TreatmentPackages from "@/components/home/TreatmentPackages";
import CostComparison from "@/components/home/CostComparison";
import MedicalCareGallery from "@/components/home/MedicalCareGallery";
import PatientTestimonials from "@/components/home/PatientTestimonials";
import InsuranceLogos from "@/components/home/InsuranceLogos";
import TravelProcess from "@/components/home/TravelProcess";
import FAQSection from "@/components/home/FAQSection";
import {
  fallbackDoctors,
  fallbackHospitals,
  fallbackInsurances,
  fallbackTestimonials,
  fallbackTreatments,
} from "@/lib/fallback-data";
import { mergeSiteImages, SITE_IMAGE_KEYS } from "@/lib/site-images";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  const [doctorsRes, hospitalsRes, treatmentsRes, testimonialsRes, insuranceRes, settingsRes] = await Promise.all([
    supabase.from("doctors").select("*").eq("is_featured", true).limit(3),
    supabase.from("hospitals").select("*").eq("is_featured", true).limit(3),
    supabase.from("treatments").select("*").eq("is_featured", true).limit(6),
    supabase.from("testimonials").select("*").eq("is_approved", true).limit(10),
    supabase.from("insurance_companies").select("name"),
    supabase.from("site_settings").select("key, value").in("key", SITE_IMAGE_KEYS),
  ]);

  const doctors = doctorsRes.data?.map((d) => ({
    name: d.name,
    specialty: d.specialties?.[0] || "Specialist",
    experience: `${d.experience_years || 0} years`,
    hospital: "",
    rating: 4.9,
    slug: d.slug,
    photo_url: d.photo_url || undefined,
  })) || [];

  const hospitals = hospitalsRes.data?.map((h) => ({
    name: h.name,
    location: `${h.city}, ${h.state}`,
    beds: `${h.beds_count?.toLocaleString() || 0}+`,
    accreditation: h.accreditations?.join(", ") || "Accredited",
    slug: h.slug,
    photo_url: h.logo_url || undefined,
  })) || [];

  const treatments = treatmentsRes.data?.map((t) => ({
    name: t.name,
    costMin: Number(t.cost_usd_min) || 0,
    costMax: Number(t.cost_usd_max) || 0,
    usCost: Number(t.cost_usd_max) * 5 || 10000,
    slug: t.slug,
    category: t.category || "General",
  })) || [];

  const testimonials = testimonialsRes.data?.map((t) => ({
    name: t.patient_name,
    country: t.country,
    treatment: t.treatment,
    text: t.text_content,
    rating: t.rating || 5,
    videoId: t.video_url?.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1] || undefined,
  })) || [];

  const insurances = insuranceRes.data?.map((i) => i.name).filter(Boolean) || [];
  const images = mergeSiteImages(settingsRes.data || undefined);

  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <HeroSection imageUrl={images.image_home_hero} />
      <StatsCounter />
      <WhyChooseUs />
      <MedicalCareGallery images={images} />
      <PatientSupportServices imageUrl={images.image_home_support} />
      <FeaturedDoctors doctors={doctors.length > 0 ? doctors : fallbackDoctors} />
      <FeaturedHospitals hospitals={hospitals.length > 0 ? hospitals : fallbackHospitals} />
      <CostComparison imageUrl={images.image_home_cost} />
      <TreatmentPackages treatments={treatments.length > 0 ? treatments : fallbackTreatments} images={images} />
      <PatientTestimonials testimonials={testimonials.length > 0 ? testimonials : fallbackTestimonials} />
      <InsuranceLogos insurances={insurances.length > 0 ? insurances : fallbackInsurances} />
      <TravelProcess />
      <FAQSection />
    </>
  );
}
