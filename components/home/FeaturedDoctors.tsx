"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import Image from "next/image";

interface Doctor {
  name: string;
  specialty: string;
  experience: string;
  hospital: string;
  rating: number;
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

export default function FeaturedDoctors({ doctors = [] }: { doctors?: Doctor[] }) {
  if (doctors.length === 0) return null;
  return (
    <section className="bg-canvas-light py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-4"
        >
          <div>
            <span className="pill-tag mb-4 inline-block">Our Experts</span>
            <h2 className="font-display text-display-md lg:text-display-lg text-ink mt-4">Featured Doctors</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">World-renowned specialists ready to provide you with the best care.</p>
          </div>
          <Link href="/doctors" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Doctors <ArrowRight size={18} />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {doctors.map((doctor) => (
            <motion.div key={doctor.slug} variants={itemVariants}>
              <Link href={`/doctors/${doctor.slug}`} className="group block bg-canvas-light rounded-xl p-6 border border-hairline-light hover:shadow-elevation-3 transition-all duration-300">
                <div className="relative w-28 h-28 sm:w-24 sm:h-24 rounded-full mx-auto mb-5 overflow-hidden bg-gradient-to-br from-aloe-10 to-pistachio-10 ring-2 ring-aloe-10/30 group-hover:ring-aloe-10 transition-all">
                  <Image
                    src={doctor.photo_url || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80"}
                    alt={doctor.name}
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-shade-60">{doctor.rating}</span>
                  </div>
                  <h3 className="font-display text-heading-md text-ink group-hover:text-shade-60 transition-colors">{doctor.name}</h3>
                  <p className="text-body-md text-shade-50 mt-1">{doctor.specialty}</p>
                  <p className="text-caption text-shade-40 mt-2">{doctor.experience} &middot; {doctor.hospital}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
