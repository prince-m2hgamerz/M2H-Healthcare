"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    treatment: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          form_type: "Contact",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          message: `${formData.treatment ? `Treatment: ${formData.treatment}\n` : ""}${formData.message}`,
        }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-aloe-10 flex items-center justify-center mx-auto mb-4">
          <Send size={28} className="text-ink" />
        </div>
        <h3 className="font-display text-heading-xl text-ink mb-2">Thank You!</h3>
        <p className="text-body-lg text-shade-50">
          We&apos;ve received your message. Our team will reach out shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <input
            type="text"
            placeholder="Your Name *"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number *"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Your Country *"
            required
            value={formData.country}
            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
          />
        </div>
      </div>
      <div>
        <input
          type="text"
          placeholder="Treatment Needed"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
        />
      </div>
      <div>
        <textarea
          placeholder="Your Message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full border border-hairline-light rounded-md px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full text-center disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
