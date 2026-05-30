"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSiteSettings } from "@/hooks/useSiteSettings";

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

const navLinks = [...primaryNavLinks, ...exploreLinks];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
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

  return (
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

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/treatment-package" className="btn-outline-dark text-sm !py-2 !px-5">
            Find Cost
          </Link>
          <Link href="/contact-us" className="btn-primary text-sm !py-2 !px-5">
            Get Free Quote
          </Link>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-on-primary p-2 -mr-2"
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
            <div className="container-cinematic py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block font-display text-heading-md transition-colors",
                    pathname === link.href || pathname.startsWith(`${link.href}/`)
                      ? "text-link-mint"
                      : "text-on-primary hover:text-link-mint"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                <Link href="/treatment-package" className="btn-outline-dark w-full text-center block">
                  Find Cost
                </Link>
                <Link href="/contact-us" className="btn-primary w-full text-center block">
                  Get Free Quote
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
