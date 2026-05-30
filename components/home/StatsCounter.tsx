"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { value: 15000, suffix: "+", label: "Patients Treated" },
  { value: 130, suffix: "+", label: "Partner Hospitals" },
  { value: 1000, suffix: "+", label: "Specialist Doctors" },
  { value: 30, suffix: "+", label: "Countries Served" },
];

function Counter({ value, suffix, label }: Stat) {
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
      className="text-center"
    >
      <div className="font-display text-display-md lg:text-display-lg text-ink">
        {count.toLocaleString()}{suffix}
      </div>
      <p className="text-body-md text-shade-50 mt-2">{label}</p>
    </motion.div>
  );
}

export default function StatsCounter() {
  return (
    <section className="bg-canvas-light py-huge">
      <div className="container-cinematic">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8">
          {stats.map((stat) => (
            <Counter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
