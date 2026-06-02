"use client";

import { Phone, Clock } from "lucide-react";
import Link from "next/link";

export default function EmergencyBanner() {
  return (
    <div className="bg-gradient-to-r from-[#1a5c4c] to-[#0d3b30] text-white py-2 px-4 relative z-40">
      <div className="container-cinematic flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 sm:gap-5 text-xs sm:text-sm">
          <a href="tel:+919650928250" className="inline-flex items-center gap-1.5 hover:text-emerald-200 transition-colors">
            <Phone size={12} className="sm:w-3.5 sm:h-3.5" />
            <span className="font-semibold">+91-9650928250</span>
          </a>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-emerald-200/80">
            <Clock size={13} />
            <span>24/7 Helpdesk</span>
          </span>
        </div>
        <Link
          href="/contact-us"
          className="inline-flex items-center gap-1.5 bg-emerald-400/20 hover:bg-emerald-400/30 border border-emerald-400/40 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold transition-all hover:-translate-y-0.5 whitespace-nowrap"
        >
          <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-400 rounded-full animate-pulse" />
          Get Doctor Opinion
        </Link>
      </div>
    </div>
  );
}
