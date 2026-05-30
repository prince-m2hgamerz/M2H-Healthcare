import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Award, MapPin, Star } from "lucide-react";
import Image from "next/image";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { fallbackDoctors } from "@/lib/fallback-data";
import { JsonLd } from "@/components/shared/JsonLd";
import { physicianSchema, breadcrumbSchema } from "@/lib/json-ld";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const supabase = await createServerSupabaseClient();
  const { data: rawDoctor } = await supabase.from("doctors").select("*").eq("slug", params.slug).single();
  const fallbackDoctor = fallbackDoctors.find((doctor) => doctor.slug === params.slug);
  const doctor = rawDoctor || fallbackDoctor;
  if (!doctor) return { title: "Doctor Not Found" };
  const name = doctor.name || "Doctor";
  const specialty = doctor.specialties?.[0] || "Specialist";
  return {
    title: name,
    description: `Dr. ${name} — ${specialty} in Delhi, India. ${doctor.about?.slice(0, 150) || `Book an appointment with Dr. ${name}, a specialist in ${specialty}.`}`,
    openGraph: { title: name, description: `Dr. ${name} — ${specialty} at Asians Healthcare.` },
  };
}

export default async function DoctorDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createServerSupabaseClient();
  const { data: rawDoctor } = await supabase.from("doctors").select("*").eq("slug", params.slug).single();
  const fallbackDoctor = fallbackDoctors.find((doctor) => doctor.slug === params.slug);
  const doctor = rawDoctor
    ? {
        name: rawDoctor.name,
        specialty: rawDoctor.specialties?.[0] || "Specialist",
        experience: `${rawDoctor.experience_years || 0} years`,
        hospital: "Partner Hospital",
        rating: 4.9,
        photo_url: rawDoctor.photo_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
        qualifications: rawDoctor.qualifications || "",
        about: rawDoctor.about || "No description available.",
      }
    : fallbackDoctor;

  if (!doctor) notFound();

  return (
    <>
      <JsonLd data={physicianSchema({
        name: doctor.name,
        description: doctor.about,
        specialty: doctor.specialty,
        image: doctor.photo_url,
        url: `https://asianshealthcare.com/doctors/${params.slug}`,
        qualifications: doctor.qualifications,
        hospitalName: doctor.hospital,
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: "Home", url: "https://asianshealthcare.com" },
        { name: "Doctors", url: "https://asianshealthcare.com/doctors" },
        { name: doctor.name, url: `https://asianshealthcare.com/doctors/${params.slug}` },
      ])} />
      <section className="bg-canvas-night text-on-primary py-20">
        <div className="container-cinematic">
          <Link href="/doctors" className="inline-flex items-center gap-2 text-link-cool-2 hover:text-on-primary mb-6 transition-colors">
            <ArrowLeft size={18} />
            Back to Doctors
          </Link>
          <div className="flex flex-col lg:flex-row gap-10 items-start">
            <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden ring-4 ring-aloe-10/30 shrink-0">
              <Image
                src={doctor.photo_url}
                alt={doctor.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="pill-tag mb-3">Doctor Profile</span>
              <h1 className="font-display text-display-md lg:text-display-lg text-on-primary mb-3">{doctor.name}</h1>
              <p className="text-body-lg text-link-cool-2 mb-2">{doctor.specialty}</p>
              <div className="flex flex-wrap items-center gap-4 text-caption text-link-cool-1">
                <span className="flex items-center gap-1"><MapPin size={14} />{doctor.hospital}</span>
                <span className="flex items-center gap-1"><Award size={14} />{doctor.experience}</span>
                <span className="flex items-center gap-1"><Star size={14} className="text-yellow-400" />{doctor.rating} rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-canvas-light py-huge">
        <div className="container-cinematic">
          <div className="max-w-reading-col mx-auto">
            <h2 className="font-display text-heading-xl text-ink mb-4">About</h2>
            <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{doctor.about}</p>
            {doctor.qualifications && (
              <>
                <h2 className="font-display text-heading-xl text-ink mb-4">Qualifications</h2>
                <p className="text-body-lg text-shade-50 leading-relaxed mb-8">{doctor.qualifications}</p>
              </>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/contact-us" className="btn-primary">Book Appointment</Link>
              <Link href="/treatment-package" className="btn-outline">View Treatment Costs</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
