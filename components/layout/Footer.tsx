"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const treatmentLinks = [
  { label: "Cardiology", href: "/speciality/cardiology" },
  { label: "Orthopedics", href: "/speciality/orthopedics" },
  { label: "Neurology", href: "/speciality/neurology" },
  { label: "Oncology", href: "/speciality/oncology" },
  { label: "Knee Replacement", href: "/treatment-package/knee-replacement" },
  { label: "Hip Replacement", href: "/treatment-package/hip-replacement" },
  { label: "Spine Surgery", href: "/treatment-package/spine-surgery" },
  { label: "Hair Transplant", href: "/treatment-package/hair-transplant" },
  { label: "IVF Treatment", href: "/treatment-package/ivf-treatment" },
  { label: "Kidney Transplant", href: "/treatment-package/kidney-transplant" },
  { label: "Liver Transplant", href: "/treatment-package/liver-transplant" },
  { label: "Bariatric Surgery", href: "/treatment-package/bariatric-surgery" },
];

const quickLinks = [
  { label: "About Us", href: "/about-us" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blogs", href: "/blogs" },
  { label: "Treatment Packages", href: "/treatment-package" },
  { label: "Specialities", href: "/speciality" },
  { label: "Medical Tourism", href: "/tourism" },
  { label: "Contact", href: "/contact-us" },
];

const patientLinks = [
  { label: "Why Choose Us", href: "/about-us" },
  { label: "How It Works", href: "/tourism" },
  { label: "Visa Assistance", href: "/contact-us" },
  { label: "Hotel Booking", href: "/hotels" },
  { label: "Insurance Partners", href: "/insurance-company" },
  { label: "Patient Stories", href: "/testimonials" },
];

export default function Footer() {
  const { site_name, contact_phone, contact_email } = useSiteSettings();

  return (
    <footer className="bg-canvas-night text-on-primary border-t border-hairline-dark">
      <div className="container-cinematic py-12 sm:py-16 lg:py-huge">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-10 lg:gap-12">
          <div>
            <Link href="/" className="font-display text-heading-lg tracking-wide">
              {site_name}
            </Link>
            <p className="text-caption text-link-cool-2 leading-relaxed max-w-xs mt-4">
              Connecting international patients with India&apos;s top hospitals and doctors.
              Your health journey starts here.
            </p>
            <div className="mt-6 space-y-2 text-caption text-link-cool-2">
              <div className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="shrink-0" />
                <a href={`tel:${contact_phone}`} className="hover:text-on-primary transition-colors">{contact_phone}</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" />
                <a href={`mailto:${contact_email}`} className="hover:text-on-primary transition-colors">{contact_email}</a>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-6">
              <a href="https://facebook.com/asianshealthcare" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-hairline-dark flex items-center justify-center text-link-cool-2 hover:text-on-primary hover:bg-shade-60 transition-colors" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="https://instagram.com/asianshealthcare" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-hairline-dark flex items-center justify-center text-link-cool-2 hover:text-on-primary hover:bg-shade-60 transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://youtube.com/@asianshealthcare" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-hairline-dark flex items-center justify-center text-link-cool-2 hover:text-on-primary hover:bg-shade-60 transition-colors" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h4 className="text-eyebrow-cap uppercase tracking-widest text-link-cool-3 mb-4">
                Treatments
              </h4>
              <ul className="space-y-3">
                {treatmentLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-eyebrow-cap uppercase tracking-widest text-link-cool-3 mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-eyebrow-cap uppercase tracking-widest text-link-cool-3 mb-4">
                For Patients
              </h4>
              <ul className="space-y-3">
                {patientLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-eyebrow-cap uppercase tracking-widest text-link-cool-3 mb-4">
                Specialities
              </h4>
              <ul className="space-y-3">
                <li><Link href="/speciality/cardiology" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Cardiology</Link></li>
                <li><Link href="/speciality/orthopedics" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Orthopedics</Link></li>
                <li><Link href="/speciality/neurology" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Neurology</Link></li>
                <li><Link href="/speciality/oncology" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Oncology</Link></li>
                <li><Link href="/speciality/gastroenterology" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Gastroenterology</Link></li>
                <li><Link href="/speciality/nephrology" className="text-caption text-link-cool-2 hover:text-on-primary transition-colors">Nephrology</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-hairline-dark py-5 sm:py-6 px-4">
        <div className="container-cinematic flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <p className="text-micro text-link-cool-2">
            &copy; {new Date().getFullYear()} {site_name}. Made with <Heart size={10} className="inline text-aloe-10" /> for better healthcare.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="text-micro text-link-cool-2 hover:text-on-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-micro text-link-cool-2 hover:text-on-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
