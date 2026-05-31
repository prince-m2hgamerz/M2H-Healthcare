"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Users, Building2, Stethoscope, Globe, Award, Clock } from "lucide-react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: React.ComponentType<{ size?: string | number; className?: string }>;
}

const stats: Stat[] = [
  { value: 15000, suffix: "+", label: "Happy Patients", icon: Users },
  { value: 130, suffix: "+", label: "Partner Hospitals", icon: Building2 },
  { value: 1000, suffix: "+", label: "Specialist Doctors", icon: Stethoscope },
  { value: 30, suffix: "+", label: "Countries Served", icon: Globe },
  { value: 500, suffix: "+", label: "Procedures Available", icon: Award },
  { value: 8, suffix: "+", label: "Years Experience", icon: Clock },
];

function Counter({ value, suffix, label, icon: Icon }: Stat) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center group"
    >
      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-aloe-10/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
        <Icon size={22} className="text-ink" />
      </div>
      <div className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text-ink">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-body-md text-shade-50 mt-2 font-medium">{label}</p>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="bg-canvas-light py-12 sm:py-huge border-b border-hairline-light">
      <div className="container-cinematic">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-heading-xl lg:text-display-md text-ink">
            Trusted by Patients Worldwide
          </h2>
          <p className="text-body-md text-shade-50 mt-2">Numbers that speak for our commitment to quality healthcare</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-6">
          {stats.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
