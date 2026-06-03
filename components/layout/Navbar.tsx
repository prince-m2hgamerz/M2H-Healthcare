"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Menu, X, Search, Home, Stethoscope, Building2, HeartPulse,
  Info, Heart, Shield, Building, Plane, Newspaper, Mail, FileText,
  DollarSign, AlertTriangle, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import dynamic from "next/dynamic";

const SearchModal = dynamic(() => import("@/components/search/SearchModal"), { ssr: false });

const primaryNavLinks = [
  { label: "Home", href: "/" },
  { label: "Doctors", href: "/doctors" },
  { label: "Hospitals", href: "/hospitals" },
  { label: "Treatments", href: "/treatment-package" },
];

const exploreLinks = [
  { label: "About", href: "/about-us" },
  { label: "Specialities", href: "/speciality" },
  { label: "Insurance", href: "/insurance-company" },
  { label: "Hotels", href: "/hotels" },
  { label: "Tourism", href: "/tourism" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact-us" },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Disclaimer", href: "/disclaimer" },
];

const linkIcon: Record<string, React.ReactNode> = {
  Home: <Home size={18} />,
  Doctors: <Stethoscope size={18} />,
  Hospitals: <Building2 size={18} />,
  Treatments: <HeartPulse size={18} />,
  About: <Info size={18} />,
  Specialities: <Heart size={18} />,
  Insurance: <Shield size={18} />,
  Hotels: <Building size={18} />,
  Tourism: <Plane size={18} />,
  Blogs: <Newspaper size={18} />,
  Contact: <Mail size={18} />,
  "Privacy Policy": <Shield size={18} />,
  Terms: <FileText size={18} />,
  "Refund Policy": <DollarSign size={18} />,
  Disclaimer: <AlertTriangle size={18} />,
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const settings = useSiteSettings();
  const siteName = settings.site_name || "Asians Healthcare";
  const exploreActive = exploreLinks.some((link) => pathname === link.href || pathname.startsWith(`${link.href}/`));

  useEffect(() => {
    setOpen(false);
    setExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-50 bg-canvas-night text-on-primary border-b border-hairline-dark">
      <div className="container-cinematic flex items-center justify-between h-16 lg:h-20">
        <Link href="/" className="shrink-0 flex items-center gap-2">
          <Image src="/logo.svg" alt={siteName} width={160} height={32} className="h-8 w-auto" priority />
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {primaryNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-caption uppercase tracking-wider transition-colors",
                pathname === link.href || pathname.startsWith(`${link.href}/`)
                  ? "text-on-primary"
                  : "text-link-cool-2 hover:text-on-primary"
              )}
            >
              {link.label}
            </Link>
          ))}

          <div
            className="relative"
            onMouseEnter={() => setExploreOpen(true)}
            onMouseLeave={() => setExploreOpen(false)}
          >
            <button
              type="button"
              onClick={() => setExploreOpen((current) => !current)}
              className={cn(
                "inline-flex items-center gap-1.5 text-caption uppercase tracking-wider transition-colors",
                exploreActive ? "text-on-primary" : "text-link-cool-2 hover:text-on-primary"
              )}
              aria-expanded={exploreOpen}
              aria-haspopup="menu"
            >
              Explore
              <ChevronDown size={15} className={cn("transition-transform", exploreOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-full mt-4 w-64 rounded-lg border border-hairline-dark bg-canvas-night-elevated p-2 shadow-elevation-4"
                  role="menu"
                >
                  {exploreLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-caption transition-colors",
                        pathname === link.href || pathname.startsWith(`${link.href}/`)
                          ? "bg-canvas-night text-on-primary"
                          : "text-link-cool-2 hover:bg-canvas-night hover:text-on-primary"
                      )}
                      role="menuitem"
                    >
                      {link.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-link-cool-2 hover:text-on-primary transition-colors border border-hairline-dark rounded-lg hover:border-hairline"
            aria-label="Search"
          >
            <Search size={18} />
            <span className="text-caption hidden xl:inline">Search...</span>
            <kbd className="hidden xl:inline-flex items-center px-1.5 py-0.5 text-[10px] text-link-cool-2 bg-canvas-night rounded border border-hairline-dark">
              ⌘K
            </kbd>
          </button>
          <Link href="/treatment-package" className="btn-outline-dark text-sm !py-2 !px-5">
            Find Cost
          </Link>
          <Link href="/contact-us" className="btn-primary text-sm !py-2 !px-5">
            Get Free Quote
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-on-primary p-3"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden bg-canvas-night border-t border-hairline-dark"
          >
            <div className="flex flex-col max-h-[80vh]">
              <div className="overflow-y-auto container-cinematic py-6 space-y-5">
                <button
                  onClick={() => { setOpen(false); setSearchOpen(true); }}
                  className="flex items-center gap-3 w-full text-left text-on-primary hover:text-link-mint transition-colors py-2.5 px-4 -mx-4 rounded-lg hover:bg-canvas-night-elevated"
                >
                  <Search size={20} />
                  <span className="font-display text-heading-sm">Search</span>
                </button>
                <hr className="border-hairline-dark" />

                <div className="space-y-2">
                  <p className="text-caption uppercase tracking-[0.12em] text-link-cool-2 font-medium px-4 text-[11px]">
                    Main
                  </p>
                  {primaryNavLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors",
                          isActive
                            ? "bg-canvas-night-elevated text-on-primary"
                            : "text-link-cool-2 hover:bg-canvas-night-elevated hover:text-on-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {linkIcon[link.label]}
                          <span className="font-display text-heading-sm">{link.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-link-cool-2" />
                      </Link>
                    );
                  })}
                </div>

                <hr className="border-hairline-dark" />

                <div className="space-y-2">
                  <p className="text-caption uppercase tracking-[0.12em] text-link-cool-2 font-medium px-4 text-[11px]">
                    Explore
                  </p>
                  {exploreLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors",
                          isActive
                            ? "bg-canvas-night-elevated text-on-primary"
                            : "text-link-cool-2 hover:bg-canvas-night-elevated hover:text-on-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {linkIcon[link.label]}
                          <span className="font-display text-heading-sm">{link.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-link-cool-2" />
                      </Link>
                    );
                  })}
                </div>

                <hr className="border-hairline-dark" />

                <div className="space-y-2">
                  <p className="text-caption uppercase tracking-[0.12em] text-link-cool-2 font-medium px-4 text-[11px]">
                    Legal
                  </p>
                  {legalLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center justify-between rounded-lg px-4 py-2.5 transition-colors",
                          isActive
                            ? "bg-canvas-night-elevated text-on-primary"
                            : "text-link-cool-2 hover:bg-canvas-night-elevated hover:text-on-primary"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {linkIcon[link.label]}
                          <span className="font-display text-heading-sm">{link.label}</span>
                        </div>
                        <ChevronRight size={14} className="text-link-cool-2" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="sticky bottom-0 border-t border-hairline-dark bg-canvas-night p-4 container-cinematic space-y-3">
                <Link href="/treatment-package" className="btn-outline-dark w-full text-center block" onClick={() => setOpen(false)}>
                  Find Cost
                </Link>
                <Link href="/contact-us" className="btn-primary w-full text-center block" onClick={() => setOpen(false)}>
                  Get Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
