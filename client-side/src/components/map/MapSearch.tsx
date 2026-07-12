"use client";

import { useEffect, useState } from "react";
import { Search, Loader2, X, MapPin } from "lucide-react";
import { searchPlaces, type GeoSearchResult } from "@/lib/geocode";

interface MapSearchProps {
  /** Called with the chosen place's coordinates. */
  onSelect: (coords: { lat: number; lng: number }) => void;
}

/** Debounced place-search overlay for the map (forward geocoding via Nominatim). */
export default function MapSearch({ onSelect }: MapSearchProps) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<GeoSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const query = q.trim();
    // All state updates happen inside the (async) timeout, never synchronously.
    const t = setTimeout(async () => {
      if (query.length < 3) {
        setResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      const hits = await searchPlaces(query, 6);
      setResults(hits);
      setOpen(true);
      setLoading(false);
    }, query.length < 3 ? 0 : 400);
    return () => clearTimeout(t);
  }, [q]);

  const pick = (r: GeoSearchResult) => {
    onSelect({ lat: r.lat, lng: r.lng });
    setQ("");
    setResults([]);
    setOpen(false);
  };

  return (
    // Stop map drag/zoom from starting when interacting with the search UI.
    <div
      className="absolute left-3 top-3 z-[1100] w-64 max-w-[calc(100%-6rem)]"
      onMouseDown={(e) => e.stopPropagation()}
      onDoubleClick={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/50" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search area or place…"
          className="w-full rounded-lg border border-mist bg-white/95 py-2 pl-8 pr-8 text-xs font-semibold text-[#342417] shadow-md outline-none focus:border-[#B05B33]"
        />
        {loading ? (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-[#5C4D3C]/50" />
        ) : q ? (
          <button
            type="button"
            onClick={() => {
              setQ("");
              setResults([]);
            }}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#5C4D3C]/50 hover:text-[#342417] cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {open && results.length > 0 && (
        <ul className="mt-1.5 max-h-52 overflow-auto rounded-lg border border-mist bg-white shadow-lg">
          {results.map((r, i) => (
            <li key={`${r.lat},${r.lng},${i}`}>
              <button
                type="button"
                onClick={() => pick(r)}
                className="flex w-full items-start gap-1.5 px-3 py-2 text-left text-[11px] font-medium text-[#342417] hover:bg-sand/60 cursor-pointer"
              >
                <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-[#B05B33]" />
                <span className="line-clamp-2">{r.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
