"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Send, Upload, Phone, User, Mail, FileText } from "lucide-react";

export default function QuickInquiryForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    treatment: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "Quick Inquiry",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: "International",
          medical_condition: formData.treatment,
          message: formData.message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", treatment: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <section className="bg-gradient-to-br from-[#0d3b30] to-[#1a5c4c] py-huge">
        <div className="container-cinematic max-w-2xl text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/10"
          >
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Send size={28} className="text-green-300" />
            </div>
            <h3 className="font-display text-display-md text-white">Thank You!</h3>
            <p className="text-body-lg text-green-100 mt-4">
              Our medical team will review your inquiry and get back to you within 24 hours with a free medical opinion.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gradient-to-br from-[#0d3b30] to-[#1a5c4c] py-12 sm:py-huge relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
      </div>

      <div className="container-cinematic relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 sm:gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-heading-xl sm:text-display-md lg:text-display-lg text-white">
              Get Free Medical Opinion &amp; Cost Estimate
            </h2>
            <p className="text-body-lg text-green-100/80 mt-6 leading-relaxed">
              Share your medical reports and our specialist team will provide a detailed treatment plan within 24 hours — completely free.
            </p>
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </div>
                <span className="text-body-md">Free doctor opinion within 24 hours</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Phone size={16} />
                </div>
                <span className="text-body-md">Personal case manager assigned</span>
              </div>
              <div className="flex items-center gap-3 text-green-100">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Upload size={16} />
                </div>
                <span className="text-body-md">Upload reports for accurate cost estimate</span>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-green-200/60">Or call us directly:</p>
              <a href="tel:+919650928250" className="font-display text-heading-xl text-white hover:text-aloe-10 transition-colors mt-2 inline-block">
                +91-9650928250
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-8 border border-white/10 shadow-xl">
              <h3 className="font-display text-heading-lg text-white mb-6">Request Free Consultation</h3>
              <div className="space-y-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200/50" />
                  <input
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-green-200/40 focus:outline-none focus:border-aloe-10 focus:ring-1 focus:ring-aloe-10/30 transition-all"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200/50" />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-green-200/40 focus:outline-none focus:border-aloe-10 focus:ring-1 focus:ring-aloe-10/30 transition-all"
                    />
                  </div>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-green-200/50" />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-11 pr-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-green-200/40 focus:outline-none focus:border-aloe-10 focus:ring-1 focus:ring-aloe-10/30 transition-all"
                    />
                  </div>
                </div>
                <select
                  value={formData.treatment}
                  onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white focus:outline-none focus:border-aloe-10 focus:ring-1 focus:ring-aloe-10/30 transition-all appearance-none"
                >
                  <option value="" className="text-ink">Select Treatment</option>
                  <option value="Cardiac Surgery" className="text-ink">Cardiac Surgery</option>
                  <option value="Knee Replacement" className="text-ink">Knee Replacement</option>
                  <option value="Hip Replacement" className="text-ink">Hip Replacement</option>
                  <option value="Spine Surgery" className="text-ink">Spine Surgery</option>
                  <option value="Liver Transplant" className="text-ink">Liver Transplant</option>
                  <option value="Kidney Transplant" className="text-ink">Kidney Transplant</option>
                  <option value="Bone Marrow Transplant" className="text-ink">Bone Marrow Transplant</option>
                  <option value="Cancer Treatment" className="text-ink">Cancer Treatment</option>
                  <option value="IVF Treatment" className="text-ink">IVF Treatment</option>
                  <option value="Neurology" className="text-ink">Neurology</option>
                  <option value="Other" className="text-ink">Other</option>
                </select>
                <textarea
                  rows={3}
                  placeholder="Describe your condition briefly..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-green-200/40 focus:outline-none focus:border-aloe-10 focus:ring-1 focus:ring-aloe-10/30 transition-all resize-none"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-lg bg-aloe-10 hover:bg-[#a8f0c0] text-ink font-display text-heading-sm transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting..." : "Get Free Opinion →"}
                </button>
              </div>
              {status === "error" && (
                <p className="text-red-300 text-caption mt-3 text-center">Something went wrong. Please try again or call us directly.</p>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
