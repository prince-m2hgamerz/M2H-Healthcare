"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getTreatmentImage, SITE_IMAGE_DEFAULTS, type SiteImageKey } from "@/lib/site-images";

interface Treatment {
  name: string;
  costMin: number;
  costMax: number;
  usCost: number;
  slug: string;
  category?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TreatmentPackages({
  treatments = [],
  images = SITE_IMAGE_DEFAULTS,
}: {
  treatments?: Treatment[];
  images?: Record<SiteImageKey, string>;
}) {
  if (treatments.length === 0) return null;
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
            <span className="pill-tag mb-4 inline-block">Affordable Care</span>
            <h2 className="font-display text-display-md lg:text-display-lg text-ink mt-4">Treatment Packages</h2>
            <p className="text-body-lg text-shade-50 max-w-xl mt-4">Save 60-80% on medical treatments in India compared to US and UK costs.</p>
          </div>
          <Link href="/treatment-package" className="btn-outline flex items-center gap-2 shrink-0 self-start lg:self-auto">
            View All Packages <ArrowRight size={18} />
          </Link>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {treatments.map((t) => (
            <motion.div key={t.slug} variants={itemVariants}>
              <Link href={`/treatment-package/${t.slug}`} className="group block overflow-hidden bg-canvas-cream rounded-xl border border-hairline-light hover:shadow-elevation-3 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-40">
                  <Image
                    src={getTreatmentImage(images, t.slug, t.category)}
                    alt={t.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-heading-lg text-ink group-hover:text-shade-60 transition-colors">{t.name}</h3>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-display text-display-md text-ink">${t.costMin.toLocaleString()}</span>
                    <span className="text-body-md text-shade-40">- ${t.costMax.toLocaleString()}</span>
                  </div>
                  <p className="text-caption text-shade-40 mt-1">In India</p>
                  <div className="mt-3 pt-3 border-t border-hairline-light">
                    <p className="text-caption text-shade-50">Comparable cost in US: <span className="text-shade-60 line-through">${t.usCost.toLocaleString()}</span></p>
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
