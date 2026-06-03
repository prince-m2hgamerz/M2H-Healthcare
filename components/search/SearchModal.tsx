"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Fuse from "fuse.js";
import { Search, X, Loader2 } from "lucide-react";
import { buildSearchIndex, type SearchItem } from "@/lib/search-index";

const categoryOrder = ["Doctor", "Hospital", "Treatment", "Specialty", "Blog", "Hotel", "Testimonial"];
const categoryColors: Record<string, string> = {
  Doctor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Hospital: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Treatment: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  Specialty: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Blog: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Hotel: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  Testimonial: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

export default function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [fuse, setFuse] = useState<Fuse<SearchItem> | null>(null);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const items = buildSearchIndex();
    setFuse(
      new Fuse(items, {
        keys: [
          { name: "title", weight: 2 },
          { name: "keywords", weight: 1 },
          { name: "description", weight: 0.5 },
        ],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 1,
      })
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const doSearch = useCallback(
    (q: string) => {
      setQuery(q);
      setSelectedIndex(-1);
      if (!q.trim() || !fuse) {
        setResults([]);
        return;
      }
      const hits = fuse.search(q.trim());
      const grouped = new Map<string, SearchItem[]>();
      for (const hit of hits) {
        const cat = hit.item.category;
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat)!.push(hit.item);
      }
      const sorted: SearchItem[] = [];
      for (const cat of categoryOrder) {
        const items = grouped.get(cat);
        if (items) sorted.push(...items.slice(0, 5));
      }
      setResults(sorted);
    },
    [fuse]
  );

  const navigate = useCallback(
    (item: SearchItem) => {
      onClose();
      router.push(item.url);
    },
    [onClose, router]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && results[selectedIndex]) {
      navigate(results[selectedIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
        else onClose();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] sm:pt-[15vh]">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl mx-2 sm:mx-4 bg-canvas-night-elevated border border-hairline-dark rounded-xl sm:rounded-2xl shadow-elevation-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 border-b border-hairline-dark">
          <Search size={18} className="sm:size-20 text-link-cool-2 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => doSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search doctors, hospitals, treatments..."
            className="flex-1 bg-transparent text-on-primary text-body-sm sm:text-lg outline-none placeholder:text-link-cool-2"
          />
          {query && (
            <button onClick={() => doSearch("")} className="text-link-cool-2 hover:text-on-primary p-1">
              <X size={18} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-link-cool-2 bg-canvas-night rounded border border-hairline-dark">
            ESC
          </kbd>
        </div>

        <div className="max-h-[65vh] sm:max-h-[60vh] overflow-y-auto overscroll-contain">
          {loading && (
            <div className="flex items-center justify-center py-8 sm:py-12">
              <Loader2 size={20} className="sm:size-24 animate-spin text-link-cool-2" />
            </div>
          )}

          {!loading && !query && (
            <div className="py-8 sm:py-12 text-center text-link-cool-2">
              <Search size={28} className="sm:size-40 mx-auto mb-3 opacity-40" />
              <p className="text-body-sm sm:text-body">Type to search across all content</p>
              <p className="text-caption mt-1">Try searching for a doctor, treatment, or hospital</p>
            </div>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 sm:py-12 text-center text-link-cool-2">
              <p className="text-body-sm sm:text-body">No results found for &quot;{query}&quot;</p>
              <p className="text-caption mt-1">Try different keywords</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-2 sm:py-3">
              {results.map((item, idx) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-start gap-3 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 text-left transition-colors ${
                    idx === selectedIndex ? "bg-canvas-night" : "hover:bg-canvas-night"
                  }`}
                >
                  {item.image ? (
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl overflow-hidden shrink-0 border border-hairline-dark">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-canvas-night flex items-center justify-center shrink-0 border border-hairline-dark">
                      <Search size={16} className="sm:size-20 text-link-cool-2" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium uppercase tracking-wider border ${
                          categoryColors[item.category] || categoryColors.Doctor
                        }`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-body-sm sm:text-body text-on-primary font-medium truncate">{item.title}</p>
                    <p className="text-link-cool-2 text-xs sm:text-sm line-clamp-1">{item.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="hidden sm:flex items-center gap-4 px-5 py-3 border-t border-hairline-dark text-[11px] text-link-cool-2">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-canvas-night rounded border border-hairline-dark">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-canvas-night rounded border border-hairline-dark">Enter</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-canvas-night rounded border border-hairline-dark">Esc</kbd> Close
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
