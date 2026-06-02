"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, MapPin } from "lucide-react";
import Image from "next/image";

interface Hospital {
  name: string;
  location: string;
  beds: string;
  accreditation: string;
  slug: string;
  photo_url?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function FeaturedHospitals({ hospitals = [] }: { hospitals?: Hospital[] }) {
  if (hospitals.length === 0) return null;
  return (
    <section className="bg-canvas-cream py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="pill-tag-shade mb-4 inline-block">Top Facilities</span>
            <h2 className="font-display text-display-md lg:text-display-lg text-ink mt-4">Featured Hospitals</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">India&apos;s most trusted healthcare institutions with international accreditation.</p>
          </div>
          <Link href="/hospitals" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Hospitals <ArrowRight size={18} />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {hospitals.map((hospital) => (
            <motion.div key={hospital.slug} variants={itemVariants}>
              <Link href={`/hospitals/${hospital.slug}`} className="group block bg-canvas-light rounded-xl border border-hairline-light overflow-hidden hover:shadow-elevation-3 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={hospital.photo_url || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80"}
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
                  <h3 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{hospital.name}</h3>
                  <div className="flex items-center gap-1 text-caption text-shade-40 mt-1">
                    <MapPin size={14} /><span>{hospital.location}</span>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-caption text-shade-50">
                    <Building2 size={14} /> <span>{hospital.beds} beds</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
