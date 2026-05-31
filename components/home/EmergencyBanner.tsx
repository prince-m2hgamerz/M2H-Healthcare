"use client";

import { Phone, Mail, Clock } from "lucide-react";
import Link from "next/link";

export default function EmergencyBanner() {
  return (
    <div className="bg-gradient-to-r from-[#1a5c4c] to-[#0d3b30] text-white py-2 sm:py-2.5 px-4 relative z-40">
      <div className="container-cinematic flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-2">
        <div className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm">
          <a href="tel:+919650928250" className="inline-flex items-center gap-1.5 hover:text-aloe-10 transition-colors">
            <Phone size={14} />
            <span className="font-medium">+91-9650928250</span>
          </a>
          <a href="mailto:info@asianshealthcare.com" className="hidden sm:inline-flex items-center gap-1.5 hover:text-aloe-10 transition-colors">
            <Mail size={14} />
            <span>info@asianshealthcare.com</span>
          </a>
          <span className="hidden md:inline-flex items-center gap-1.5 text-green-200">
            <Clock size={14} />
            <span>24/7 Patient Helpdesk</span>
          </span>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-1.5 bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:-translate-y-0.5"
        >
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          Receive Doctor Opinion
        </Link>
      </div>
    </div>
  );
}
