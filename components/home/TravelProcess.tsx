"use client";

import { motion } from "framer-motion";
import { FileText, Search, FileCheck, Plane, Car, Heart, Home } from "lucide-react";

const steps = [
  { icon: FileText, title: "Share Medical Details", description: "Send reports and medical history for specialist review." },
  { icon: Search, title: "Review Opinion & Cost", description: "Compare relevant doctors, hospitals, and treatment estimates." },
  { icon: FileCheck, title: "Receive Visa Invitation", description: "Get hospital invitation support for the medical visa process." },
  { icon: Plane, title: "Plan Travel & Stay", description: "Coordinate arrival date, accommodation, and local transport." },
  { icon: Car, title: "Airport Pickup", description: "Meet the local team and move directly to your hotel or hospital." },
  { icon: Heart, title: "Begin Treatment", description: "Get appointment, admission, interpreter, and case-manager support." },
  { icon: Home, title: "Return with Follow-Up", description: "Carry discharge papers, medication plan, and remote follow-up." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function TravelProcess() {
  return (
    <section className="bg-canvas-light py-12 sm:py-huge overflow-hidden">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-16"
        >
          <span className="pill-tag mb-4 inline-block">Your Journey</span>
          <h2 className="font-display text-display-md lg:text-display-lg text-ink mt-4">
            Your Medical Journey to India
          </h2>
          <p className="text-body-md sm:text-body-lg text-shade-50 max-w-2xl mx-auto mt-3 sm:mt-4">
            A simple 7-step process for international patients travelling to India for treatment.
          </p>
        </motion.div>

        {/* Mobile: Vertical timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="lg:hidden relative"
        >
          {/* Vertical line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-hairline-light" />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                variants={itemVariants}
                className="flex gap-4 relative"
              >
                {/* Step number + icon */}
                <div className="relative z-10 shrink-0">
                  <div className="w-12 h-12 rounded-full bg-canvas-cream border-2 border-ink/10 flex items-center justify-center shadow-sm">
                    <step.icon size={20} className="text-ink" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pb-2 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink bg-aloe-10 px-2 py-0.5 rounded-full">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-heading-md text-ink">{step.title}</h3>
                  <p className="text-body-md text-shade-50 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Desktop: Alternating timeline */}
        <div className="hidden lg:block relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-hairline-light -translate-x-1/2" />

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
                className={`flex items-center gap-12 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}
              >
                <div className={`flex-1 ${i % 2 === 0 ? "text-right" : "text-left"}`}>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-ink bg-aloe-10 px-2.5 py-1 rounded-full mb-2">
                    Step {i + 1}
                  </span>
                  <h3 className="font-display text-heading-lg text-ink mb-2">{step.title}</h3>
                  <p className="text-body-md text-shade-50 max-w-md leading-relaxed inline-block">{step.description}</p>
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="w-14 h-14 rounded-full bg-canvas-cream border-2 border-ink/10 flex items-center justify-center shadow-elevation-1">
                    <step.icon size={24} className="text-ink" />
                  </div>
                </div>

                <div className="flex-1" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
