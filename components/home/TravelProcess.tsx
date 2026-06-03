"use client";

import { motion } from "framer-motion";

const IMAGE_URL =
  "https://satyughealthcare.com/assets/front/images/travelprocessdesktop.jpg";

const PROXY_URL = `/api/image-proxy?url=${encodeURIComponent(IMAGE_URL)}`;

export default function TravelProcess() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 lg:mb-14"
        >
          <span className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            Your Journey
          </span>

          <h2 className="mt-5 text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900">
            Your Medical Journey to India
          </h2>

          <p className="mt-4 max-w-3xl mx-auto text-slate-600 text-base md:text-lg">
            A simple 7-step process for international patients travelling to
            India for treatment.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-[24px] md:rounded-[40px] overflow-hidden border border-slate-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
            {/* Mobile Notice */}
            <div className="md:hidden text-center text-xs text-slate-500 py-3 border-b bg-slate-50">
              Swipe horizontally to view the full journey →
            </div>

            {/* Mobile */}
            <div className="md:hidden overflow-x-auto overflow-y-hidden">
              <div className="w-[1800px] overflow-hidden">
                <img
                  src={PROXY_URL}
                  alt="Medical travel journey to India"
                  loading="lazy"
                  className="w-full h-auto block scale-[1.15] origin-center"
                  style={{
                    marginTop: "-8%",
                    marginBottom: "-8%",
                  }}
                />
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-hidden p-4">
              <img
                src={PROXY_URL}
                alt="Medical travel journey to India"
                loading="lazy"
                className="w-full h-auto rounded-[28px] block"
                style={{
                  marginTop: "-4%",
                  marginBottom: "-4%",
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8"
        >
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our international patient care team assists you from consultation
            and visa support to treatment, recovery, and your return home.
          </p>
        </motion.div>
      </div>
    </section>
  );
}