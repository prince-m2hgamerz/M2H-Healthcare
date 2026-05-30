"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send, Mail, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

export default function AdminEmailMarketingPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("newsletter_subscribers")
      .select("email", { count: "exact", head: true })
      .then(({ count }) => setSubscriberCount(count || 0));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !body.trim()) return;
    setSending(true);
    setResult(null);

    try {
      const res = await fetch("/api/email-marketing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: subject.trim(), body: body.trim() }),
      });
      const json = await res.json();
      if (res.ok) {
        setResult({ success: true, message: json.message });
        setSubject("");
        setBody("");
      } else {
        setResult({ success: false, message: json.error || "Failed to send" });
      }
    } catch {
      setResult({ success: false, message: "Network error. Please try again." });
    }
    setSending(false);
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h2 className="font-display text-heading-lg text-ink">Email Marketing</h2>
        <p className="text-body-md text-shade-50 mt-1">
          Send an email to all {subscriberCount} newsletter subscribers.
        </p>
      </div>

      {result && (
        <div className={`flex items-start gap-3 p-4 rounded-lg border ${
          result.success ? "bg-aloe-10/10 border-aloe-10/30 text-ink" : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {result.success ? <CheckCircle size={20} className="text-aloe-10 shrink-0 mt-0.5" /> : <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />}
          <p className="text-body-md">{result.message}</p>
        </div>
      )}

      <form onSubmit={handleSend} className="space-y-5 bg-canvas-cream border border-hairline-light rounded-xl p-6">
        <div>
          <label className="block text-caption text-shade-50 font-medium mb-1.5">Subject Line</label>
          <input
            type="text"
            required
            placeholder="e.g. New Treatment Cost Guide Available"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full border border-hairline-light rounded-lg px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors bg-canvas-light"
          />
        </div>

        <div>
          <label className="block text-caption text-shade-50 font-medium mb-1.5">Email Body (HTML supported)</label>
          <textarea
            required
            rows={12}
            placeholder="Write your email content here... HTML tags like &lt;h2&gt;, &lt;p&gt;, &lt;a&gt;, &lt;strong&gt; are supported."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full border border-hairline-light rounded-lg px-4 py-3 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors bg-canvas-light font-mono text-sm resize-y"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-caption text-shade-50">
            <Mail size={16} />
            Will send to <strong className="text-ink">{subscriberCount}</strong> subscriber{subscriberCount !== 1 ? "s" : ""}
          </div>
          <button
            type="submit"
            disabled={sending || !subject.trim() || !body.trim() || subscriberCount === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {sending ? (
              <><Loader2 size={16} className="animate-spin" /> Sending...</>
            ) : (
              <><Send size={16} /> Send to All Subscribers</>
            )}
          </button>
        </div>
      </form>

      <div className="bg-canvas-cream border border-hairline-light rounded-xl p-5">
        <h3 className="font-display text-heading-sm text-ink mb-2">Tips</h3>
        <ul className="space-y-1.5 text-body-md text-shade-50">
          <li>• Use <strong className="text-ink">HTML tags</strong> to format your email (headings, links, bold text)</li>
          <li>• Keep the subject line under 60 characters for best delivery</li>
          <li>• Emails are sent individually to each subscriber via Resend</li>
          <li>• Unsubscribe links are not automatically added — include a note about unsubscribing</li>
        </ul>
      </div>
    </div>
  );
}
