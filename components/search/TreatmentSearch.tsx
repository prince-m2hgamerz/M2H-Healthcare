"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function TreatmentSearch() {
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-shade-40" size={20} />
      <input
        type="text"
        placeholder="Search treatments, procedures..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full border border-hairline-light rounded-pill pl-12 pr-4 py-3.5 text-body-md text-ink placeholder:text-shade-40 focus:outline-none focus:border-ink transition-colors"
      />
    </div>
  );
}
