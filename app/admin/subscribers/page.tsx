"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Mail, Calendar, Trash2 } from "lucide-react";

interface Subscriber {
  email: string;
  subscribed_at: string;
}

export default function AdminSubscribersPage() {
  const [data, setData] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    const supabase = createClient();
    supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false })
      .then(({ data: items }) => {
        if (items) setData(items as Subscriber[]);
        setLoading(false);
      });
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (email: string) => {
    if (!confirm(`Remove ${email} from subscribers?`)) return;
    const supabase = createClient();
    await supabase.from("newsletter_subscribers").delete().eq("email", email);
    fetchData();
  };

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-shade-20 rounded w-48" />
        <div className="h-8 bg-shade-20 rounded w-64" />
        {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-shade-20 rounded" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-heading-lg text-ink">Email Subscribers</h2>
        <p className="text-body-md text-shade-50 mt-1">
          {data.length} subscriber{data.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      {data.length === 0 ? (
        <div className="text-center border border-hairline-light rounded-lg p-10 bg-canvas-cream">
          <Mail size={40} className="text-shade-30 mx-auto mb-3" />
          <h3 className="font-display text-heading-md text-ink mb-1">No subscribers yet</h3>
          <p className="text-body-md text-shade-50">Subscribers from the newsletter signup form will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-hairline-light rounded-lg">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-canvas-cream text-caption text-shade-50 uppercase tracking-wider">
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Subscribed Date</th>
                <th className="p-4 font-medium w-20">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline-light">
              {data.map((sub) => (
                <tr key={sub.email} className="hover:bg-canvas-cream/50 transition-colors">
                  <td className="p-4 text-body-md text-ink">{sub.email}</td>
                  <td className="p-4 text-body-md text-shade-50">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar size={14} className="text-shade-40" />
                      {new Date(sub.subscribed_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => handleDelete(sub.email)}
                      className="p-2 text-shade-40 hover:text-red-500 transition-colors rounded-md hover:bg-red-50"
                      title="Remove subscriber"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
