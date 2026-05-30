"use client";

import { motion } from "framer-motion";
import { FileText, Search, FileCheck, Plane, Car, Heart, Home } from "lucide-react";

const steps = [
  { icon: FileText, title: "Share Medical Details", description: "Send reports and medical history for specialist review." },
  { icon: Search, title: "Review Opinion and Cost", description: "Compare relevant doctors, hospitals, and treatment estimates." },
  { icon: FileCheck, title: "Receive Visa Invitation", description: "Get hospital invitation support for the medical visa process." },
  { icon: Plane, title: "Plan Travel and Stay", description: "Coordinate arrival date, accommodation, and local transport." },
  { icon: Car, title: "Airport Pickup", description: "Meet the local team and move directly to your hotel or hospital." },
  { icon: Heart, title: "Begin Treatment", description: "Get appointment, admission, interpreter, and case-manager support." },
  { icon: Home, title: "Return with Follow-Up", description: "Carry discharge papers, medication plan, and remote follow-up guidance." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function TravelProcess() {
  return (
    <section className="bg-canvas-light py-huge overflow-hidden">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="pill-tag mb-4 inline-block">Your Journey</span>
          <h2 className="font-display text-display-md lg:text-display-lg text-ink mt-4">
            Your Medical Journey to India
          </h2>
          <p className="text-body-lg text-shade-50 max-w-2xl mx-auto mt-4">
            A practical flow for international patients travelling to India for care.
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-hairline-light -translate-x-1/2" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="relative space-y-12"
          >
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className={`flex flex-col ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-start lg:items-center gap-6 lg:gap-12`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}>
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="text-caption text-aloe-10 font-medium">Step {i + 1}</span>
                  </div>
                  <h3 className="font-display text-heading-lg text-ink mb-2">{step.title}</h3>
                  <p className="text-body-md text-shade-50 max-w-md leading-relaxed">{step.description}</p>
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-canvas-cream border-2 border-aloe-10/30 flex items-center justify-center shadow-elevation-1">
                    <step.icon size={24} className="text-ink" />
                  </div>
                </div>

                <div className="flex-1 hidden lg:block" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
