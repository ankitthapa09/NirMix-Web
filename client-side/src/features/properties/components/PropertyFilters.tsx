"use client";

import {
  Search,
  SlidersHorizontal,
  RotateCcw,
  ChevronDown,
  Check,
} from "lucide-react";
import { ListingFilters, ListingMode, DISTRICT_OPTIONS } from "../types";
import { getDynamicSections, showsBedBath, FilterControl } from "../filter-schema";

interface PropertyFiltersProps {
  mode: ListingMode;
  filters: ListingFilters;
  onChange: (next: Partial<ListingFilters>) => void;
  onReset: () => void;
  resultCount: number;
}

const BED_OPTIONS = ["1", "2", "3", "4+"];
const PRICE_PRESETS_BUY = [
  { label: "< 1 Cr", min: "", max: "10000000" },
  { label: "1–3 Cr", min: "10000000", max: "30000000" },
  { label: "3–6 Cr", min: "30000000", max: "60000000" },
  { label: "6 Cr +", min: "60000000", max: "" },
];
const PRICE_PRESETS_RENT = [
  { label: "< 25K", min: "", max: "25000" },
  { label: "25–50K", min: "25000", max: "50000" },
  { label: "50–100K", min: "50000", max: "100000" },
  { label: "100K +", min: "100000", max: "" },
];

export function PropertyFilters({
  mode,
  filters,
  onChange,
  onReset,
  resultCount,
}: PropertyFiltersProps) {
  const accent = mode === "rent" ? "#157A74" : "#B05B33";
  const accentSoft = mode === "rent" ? "rgba(21,122,116,0.10)" : "rgba(176,91,51,0.10)";

  // Effective status drives price scale + commercial-term filters.
  const effectiveStatus =
    mode === "buy" ? "sale" : mode === "rent" ? "rent" : filters.listingType;

  const presets =
    effectiveStatus === "sale"
      ? PRICE_PRESETS_BUY
      : effectiveStatus === "rent"
        ? PRICE_PRESETS_RENT
        : [];

  const dynamicSections = getDynamicSections(effectiveStatus, filters.category);
  const showBedBath = showsBedBath(filters.category);

  const labelCls = "mb-2.5 block text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#5C4D3C]/65";
  const inputCls =
    "w-full rounded-xl border border-mist bg-sand/40 px-3 py-2.5 text-xs font-semibold text-[#342417] placeholder-[#5C4D3C]/40 outline-none transition focus:border-[#342417]/30 focus:bg-white focus:ring-2 focus:ring-[#342417]/5";

  // ── extra (dynamic) value helpers ──
  const setExtra = (key: string, values: string[]) =>
    onChange({ extra: { ...filters.extra, [key]: values } });
  const extraOf = (key: string) => filters.extra[key] ?? [];
  const toggleChip = (key: string, opt: string) => {
    const cur = extraOf(key);
    setExtra(key, cur.includes(opt) ? cur.filter((v) => v !== opt) : [...cur, opt]);
  };

  // Connected segmented control (bedrooms / bathrooms) — a render helper, not a
  // nested component, so it doesn't remount on each render.
  const renderSegmented = (value: string, onPick: (v: string) => void) => (
    <div className="grid grid-cols-4 gap-1 rounded-xl border border-mist bg-sand/40 p-1">
      {BED_OPTIONS.map((b) => {
        const active = value === b;
        return (
          <button
            key={b}
            type="button"
            onClick={() => onPick(active ? "" : b)}
            style={active ? { backgroundColor: accent, color: "#fff" } : undefined}
            className={`rounded-lg py-1.5 text-xs font-bold transition cursor-pointer ${
              active ? "shadow-sm" : "text-[#5C4D3C]/70 hover:text-[#342417]"
            }`}
          >
            {b}
          </button>
        );
      })}
    </div>
  );

  const renderControl = (c: FilterControl) => {
    const selected = extraOf(c.key);
    if (c.kind === "chips") {
      return (
        <div className="flex flex-wrap gap-1.5">
          {c.options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggleChip(c.key, opt)}
                style={active ? { borderColor: accent, backgroundColor: accentSoft, color: "#342417" } : undefined}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-bold transition-all cursor-pointer ${
                  active
                    ? "shadow-[0_2px_8px_-3px_rgba(52,36,23,0.4)]"
                    : "border-mist bg-white text-[#5C4D3C]/70 hover:border-[#342417]/25 hover:text-[#342417]"
                }`}
              >
                {active && <Check className="h-3 w-3" style={{ color: accent }} />}
                {opt}
              </button>
            );
          })}
        </div>
      );
    }
    if (c.kind === "select") {
      return (
        <div className="relative">
          <select
            value={selected[0] ?? ""}
            onChange={(e) => setExtra(c.key, e.target.value ? [e.target.value] : [])}
            className={`${inputCls} cursor-pointer appearance-none pr-9`}
          >
            <option value="">Any</option>
            {c.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
        </div>
      );
    }
    // toggle
    const on = selected.length > 0;
    return (
      <button
        type="button"
        onClick={() => setExtra(c.key, on ? [] : ["on"])}
        style={on ? { backgroundColor: accent, borderColor: accent } : undefined}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition ${on ? "" : "border-mist bg-white"}`}
        aria-pressed={on}
      >
        <span
          className={`mx-0.5 h-4 w-4 rounded-full shadow transition-transform ${on ? "translate-x-5 bg-white" : "bg-[#CBBfA6]"}`}
        />
      </button>
    );
  };

  return (
    <aside className="w-full min-w-0">
      <div className="lg:sticky lg:top-24 rounded-3xl border border-mist bg-white/85 backdrop-blur-md shadow-[0_18px_50px_-22px_rgba(52,36,23,0.35)] overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center justify-between gap-2 px-5 py-4"
          style={{ background: `linear-gradient(180deg, ${accent}10, transparent)` }}
        >
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm"
              style={{ backgroundColor: accent, color: "#fff" }}
            >
              <SlidersHorizontal className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-extrabold text-[#342417] leading-none">Filters</p>
              <p className="text-[11px] text-[#5C4D3C]/60 mt-1.5">
                <span className="font-bold" style={{ color: accent }}>{resultCount}</span> result{resultCount !== 1 ? "s" : ""}
                {filters.category ? ` · ${filters.category}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 rounded-lg border border-mist bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-[#5C4D3C]/70 hover:text-[#342417] hover:border-[#342417]/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </button>
        </div>

        <div className="max-h-[calc(100vh-12rem)] overflow-y-auto px-5 pb-6 pt-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#342417]/15">
          <div className="divide-y divide-mist/70">
            {/* Keyword */}
            <div className="py-5">
              <label className={labelCls}>Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
                <input
                  type="text"
                  value={filters.keyword}
                  onChange={(e) => onChange({ keyword: e.target.value })}
                  placeholder="Title or location…"
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>

            {/* Price */}
            <div className="py-5">
              <label className={labelCls}>
                {effectiveStatus === "rent" ? "Monthly rent (NPR)" : "Price (NPR)"}
              </label>
              {presets.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {presets.map((p) => {
                    const active = filters.minPrice === p.min && filters.maxPrice === p.max;
                    return (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => onChange({ minPrice: p.min, maxPrice: p.max })}
                        style={active ? { borderColor: accent, backgroundColor: accentSoft, color: "#342417" } : undefined}
                        className={`rounded-full border px-3 py-1.5 text-[11px] font-bold transition cursor-pointer ${
                          active ? "" : "border-mist bg-white text-[#5C4D3C]/70 hover:text-[#342417]"
                        }`}
                      >
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => onChange({ minPrice: e.target.value })}
                  placeholder="Min"
                  className={inputCls}
                />
                <span className="text-[#5C4D3C]/30">—</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => onChange({ maxPrice: e.target.value })}
                  placeholder="Max"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Bedrooms / Bathrooms (dwellings only) */}
            {showBedBath && (
              <div className="grid grid-cols-2 gap-4 py-5">
                <div>
                  <label className={labelCls}>Beds</label>
                  {renderSegmented(filters.beds, (v) => onChange({ beds: v }))}
                </div>
                <div>
                  <label className={labelCls}>Baths</label>
                  {renderSegmented(filters.baths, (v) => onChange({ baths: v }))}
                </div>
              </div>
            )}

            {/* District + Area */}
            <div className="grid grid-cols-1 gap-4 py-5">
              <div>
                <label className={labelCls}>District</label>
                <div className="relative">
                  <select
                    value={filters.district}
                    onChange={(e) => onChange({ district: e.target.value })}
                    className={`${inputCls} cursor-pointer appearance-none pr-9`}
                  >
                    <option value="">All districts</option>
                    {DISTRICT_OPTIONS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Min area (sqft)</label>
                <input
                  type="number"
                  value={filters.minArea}
                  onChange={(e) => onChange({ minArea: e.target.value })}
                  placeholder="e.g. 1000"
                  className={inputCls}
                />
              </div>
            </div>

            {/* Dynamic, category/status-aware sections */}
            {dynamicSections.map((section) => (
              <div key={section.title} className="py-5">
                <label className={labelCls}>{section.title}</label>
                <div className="space-y-4">
                  {section.controls.map((c) => (
                    <div key={c.key}>
                      {c.kind === "toggle" ? (
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-[#342417]">{c.label}</span>
                          {renderControl(c)}
                        </div>
                      ) : (
                        <>
                          <p className="mb-2 text-[11px] font-bold text-[#5C4D3C]/70">{c.label}</p>
                          {renderControl(c)}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
