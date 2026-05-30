import Link from "next/link";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

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
  return (
    <footer className="bg-canvas-night text-on-primary border-t border-hairline-dark">
      <div className="container-cinematic py-16 lg:py-huge">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="font-display text-heading-lg tracking-wide">
              Asians <span className="text-link-mint">Healthcare</span>
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
                <a href="tel:+919650928250" className="hover:text-on-primary transition-colors">+91 96509 28250</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="shrink-0" />
                <a href="mailto:info@asianshealthcare.com" className="hover:text-on-primary transition-colors">info@asianshealthcare.com</a>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-eyebrow-cap uppercase tracking-widest text-link-cool-3 mb-4">
              Treatments
            </h4>
            <ul className="space-y-2.5">
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
            <ul className="space-y-2.5">
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
            <ul className="space-y-2.5">
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
            <ul className="space-y-2.5">
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

      <div className="border-t border-hairline-dark py-6">
        <div className="container-cinematic flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-micro text-link-cool-2 text-center md:text-left">
            &copy; {new Date().getFullYear()} Asians Healthcare. Made with <Heart size={10} className="inline text-aloe-10" /> for better healthcare.
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
