"use client";

import { motion } from "framer-motion";
import { Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GetConsultation() {
  return (
    <section className="relative bg-gradient-to-br from-canvas-night via-surface-elevated-dark to-canvas-night py-12 sm:py-20 overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-aloe-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pistachio-10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="container-cinematic relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text-on-primary">
            Get a Free Medical Opinion Within 24 Hours
          </h2>
          <p className="text-body-lg text-link-cool-2 mt-4 max-w-2xl mx-auto">
            Share your medical reports and our specialist team will provide you with a detailed treatment plan,
            cost estimation, and doctor recommendations — completely free of charge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
            <Link
              href="/contact-us"
              className="btn-aloe flex items-center gap-2 text-base px-8 py-4 w-full sm:w-auto justify-center"
            >
              Get Free Consultation
              <ArrowRight size={18} />
            </Link>
            <a
              href="https://api.whatsapp.com/send?phone=919650928250&text=Hello%2C+I+need+medical+assistance"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border border-hairline-dark text-on-primary hover:bg-white/10 transition-all text-base font-medium w-full sm:w-auto justify-center"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 text-link-cool-2">
            <a href="tel:+919650928250" className="inline-flex items-center gap-2 hover:text-on-primary transition-colors">
              <Phone size={16} />
              <span className="text-body-md">+91-9650928250</span>
            </a>
            <span className="hidden sm:inline text-shade-60">|</span>
            <p className="text-body-md">Available 24/7 for International Patients</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
