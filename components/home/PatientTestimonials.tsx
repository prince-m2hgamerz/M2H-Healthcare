"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, Video } from "lucide-react";

interface Testimonial {
  name: string;
  country: string;
  treatment: string;
  text: string;
  rating: number;
  videoId?: string;
}

export default function PatientTestimonials({ testimonials = [] }: { testimonials?: Testimonial[] }) {
  const [current, setCurrent] = useState(0);

  if (testimonials.length === 0) return null;

  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));

  const t = testimonials[current];

  return (
    <section className="bg-canvas-night text-on-primary py-12 sm:py-huge">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="pill-tag mb-4 inline-block">Patient Stories</span>
          <h2 className="font-display text-display-md lg:text-display-lg mt-4">What Our Patients Say</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={20} className="fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <blockquote className="font-display text-heading-lg sm:text-heading-xl text-on-primary leading-relaxed mb-6 sm:mb-8">
                &ldquo;{t.text}&rdquo;
              </blockquote>
              <p className="text-body-lg text-link-cool-2">{t.name}</p>
              <p className="text-caption text-link-cool-1">{t.country} &middot; {t.treatment}</p>

              {t.videoId && (
                <a
                  href={`https://www.youtube.com/watch?v=${t.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 text-sm text-link-mint hover:text-link-mint/80 transition-colors"
                >
                  <Video size={18} />
                  Watch video testimonial
                </a>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-12 h-12 rounded-full border border-hairline-dark flex items-center justify-center hover:bg-canvas-night-elevated transition-colors shrink-0" aria-label="Previous testimonial">
              <ChevronLeft size={20} />
            </button>
            <div className="flex gap-1">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`p-2 ${i === current ? "text-on-primary" : "text-shade-60"}`} aria-label={`Go to testimonial ${i + 1}`}>
                  <span className={`block w-3 h-3 rounded-full transition-colors ${i === current ? "bg-on-primary" : "bg-shade-60"}`} />
                </button>
              ))}
            </div>
            <button onClick={next} className="w-12 h-12 rounded-full border border-hairline-dark flex items-center justify-center hover:bg-canvas-night-elevated transition-colors shrink-0" aria-label="Next testimonial">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
