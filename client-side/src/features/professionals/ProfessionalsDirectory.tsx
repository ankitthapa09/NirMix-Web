"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Search, ChevronRight, ChevronDown, MapPin, BadgeCheck, Briefcase, X,
  SlidersHorizontal, RotateCcw, Check, SearchX, ArrowRight, LayoutGrid,
} from "lucide-react";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { fetchPublicPortfolios, type PublicPortfolio } from "@/lib/portfolio-api";
import { PORTFOLIO_SCHEMAS, type PortfolioCategory, type FieldConfig } from "@/lib/portfolio-schemas";
import { ALL_DISTRICTS, LANGUAGE_OPTIONS } from "@/lib/nepal-geo";
import { CATEGORY_ICON, CATEGORY_ORDER, CATEGORY_PLURAL, FALLBACK_ICON, FILTER_KEYS } from "./categoryMeta";

const ACCENT = "#B05B33";
const SORT_LABELS: Record<Filters["sort"], string> = {
  newest: "Newest first",
  experience: "Most experienced",
  name: "Name (A–Z)",
};

type CategoryFilter = "all" | PortfolioCategory;

interface Filters {
  keyword: string;
  district: string;
  verifiedOnly: boolean;
  languages: string[];
  sort: "newest" | "experience" | "name";
  // Category-specific filters, keyed by the schema field key (reset when category changes).
  extra: Record<string, string[]>;
}

const EMPTY_FILTERS: Filters = {
  keyword: "", district: "", verifiedOnly: false, languages: [], sort: "newest", extra: {},
};

// Schema field types that make useful filters (discrete options or a boolean).
const FILTERABLE_TYPES = new Set<FieldConfig["type"]>(["card-select", "chip-multiselect", "dropdown", "toggle"]);

// Only the curated, client-relevant fields (FILTER_KEYS), in that order.
function filterFieldsFor(category: PortfolioCategory): FieldConfig[] {
  const byKey = new Map(PORTFOLIO_SCHEMAS[category].flatMap((s) => s.fields).map((f) => [f.key, f]));
  return (FILTER_KEYS[category] ?? [])
    .map((k) => byKey.get(k))
    .filter((f): f is FieldConfig => !!f && FILTERABLE_TYPES.has(f.type));
}

interface Props {
  initialCategory?: PortfolioCategory;
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  crumb?: string;
}

// ── Card ─────────────────────────────────────────────────────────────────────
function ProfessionalCard({ pro }: { pro: PublicPortfolio }) {
  const Icon = CATEGORY_ICON[pro.category] ?? FALLBACK_ICON;
  const initials = pro.owner.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  return (
    <Link
      href={`/professionals/${pro.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-mist bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-20px_rgba(52,36,23,0.45)]"
    >
      {/* Header band */}
      <div className="relative h-20 overflow-hidden" style={{ background: `linear-gradient(120deg, ${ACCENT}14, ${ACCENT}05)` }}>
        {pro.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pro.coverImage.url} alt="" className="h-full w-full object-cover opacity-60" />
        )}
        <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide shadow-sm" style={{ color: ACCENT }}>
          <Icon className="h-3 w-3" /> {pro.categoryLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4">
        {/* Avatar overlaps the band */}
        <div className="-mt-8 mb-2 flex items-end justify-between">
          <div className="h-16 w-16 overflow-hidden rounded-2xl border-4 border-white bg-[#F1E9DD] shadow-sm">
            {pro.owner.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pro.owner.avatar} alt={pro.owner.name} className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-lg font-black" style={{ color: ACCENT }}>{initials || "N"}</span>
            )}
          </div>
          {pro.availability && (
            <span className="mb-1 inline-flex items-center gap-1 rounded-full bg-sand/60 px-2 py-0.5 text-[10px] font-bold text-[#5C4D3C]">
              <span className={`h-1.5 w-1.5 rounded-full ${pro.availability === "Available" ? "bg-emerald-500" : "bg-[#C9A24B]"}`} />
              {pro.availability}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[15px] font-extrabold text-[#342417]">{pro.owner.name}</h3>
          {pro.owner.verified && <BadgeCheck className="h-4 w-4 shrink-0 text-[#157A74]" />}
        </div>

        {pro.headline && <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-[#5C4D3C]/85">{pro.headline}</p>}

        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[11.5px] text-[#5C4D3C]/70">
          {pro.owner.location && <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {pro.owner.location}</span>}
          {pro.experienceYears != null && <span className="inline-flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {pro.experienceYears} yr{pro.experienceYears === 1 ? "" : "s"}</span>}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-mist/70 pt-3">
          <span className="text-[11px] font-semibold text-[#5C4D3C]/55">
            {pro.serviceAreas.length > 0 ? `${pro.serviceAreas.length} area${pro.serviceAreas.length === 1 ? "" : "s"}` : "—"}
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] font-bold transition-all group-hover:gap-1.5" style={{ color: ACCENT }}>
            View profile <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-mist bg-white">
      <div className="h-20 w-full animate-pulse bg-[#EFE7D8]" />
      <div className="px-4 pb-4">
        <div className="-mt-8 mb-3 h-16 w-16 animate-pulse rounded-2xl border-4 border-white bg-[#EFE7D8]" />
        <div className="space-y-2">
          <div className="h-3.5 w-2/3 animate-pulse rounded bg-[#EFE7D8]" />
          <div className="h-3 w-full animate-pulse rounded bg-[#EFE7D8]" />
          <div className="h-3 w-1/2 animate-pulse rounded bg-[#EFE7D8]" />
        </div>
      </div>
    </div>
  );
}

// Selectable pill: solid-fill when active, soft-fill with hover-lift when not.
function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={active ? { backgroundColor: ACCENT } : undefined}
      className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[11.5px] font-bold transition-all duration-200 active:scale-95 ${
        active
          ? "text-white shadow-[0_5px_14px_-5px_rgba(176,91,51,0.75)]"
          : "bg-[#F3ECDF] text-[#5C4D3C]/80 ring-1 ring-transparent hover:-translate-y-0.5 hover:bg-white hover:text-[#342417] hover:shadow-[0_5px_12px_-6px_rgba(52,36,23,0.45)] hover:ring-mist"
      }`}
    >
      {active && <Check className="h-3 w-3" />} {label}
    </button>
  );
}

// A labelled filter group with an active-count badge and a chip row.
function FilterGroup({ label, count, children }: { label: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2.5 flex items-center gap-2">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#342417]/55">{label}</p>
        {count > 0 && (
          <span className="rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none" style={{ backgroundColor: `${ACCENT}1f`, color: ACCENT }}>
            {count}
          </span>
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      style={on ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${on ? "" : "border-mist bg-white"}`}
    >
      <span className={`mx-0.5 h-4 w-4 rounded-full shadow transition-transform duration-200 ${on ? "translate-x-5 bg-white" : "bg-[#CBBfA6]"}`} />
    </button>
  );
}

// ── Directory ────────────────────────────────────────────────────────────────
export function ProfessionalsDirectory({ initialCategory, eyebrow, title, subtitle, crumb }: Props) {
  const [all, setAll] = useState<PublicPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [category, setCategory] = useState<CategoryFilter>(initialCategory ?? "all");
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);

  const update = (next: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...next }));
  const reset = () => { setFilters(EMPTY_FILTERS); setCategory(initialCategory ?? "all"); };

  // Selecting a category clears the previous category's specific filters.
  const selectCategory = (id: CategoryFilter) => {
    setCategory(id);
    setFilters((prev) => ({ ...prev, extra: {} }));
  };

  const extraOf = (key: string) => filters.extra[key] ?? [];
  const toggleExtra = (key: string, val: string) => {
    const cur = extraOf(key);
    update({ extra: { ...filters.extra, [key]: cur.includes(val) ? cur.filter((v) => v !== val) : [...cur, val] } });
  };
  const toggleExtraBool = (key: string) => {
    update({ extra: { ...filters.extra, [key]: extraOf(key).length ? [] : ["on"] } });
  };

  // Category-specific filter fields (empty when viewing all).
  const catFields = useMemo(() => (category === "all" ? [] : filterFieldsFor(category)), [category]);

  useEffect(() => {
    let active = true;
    fetchPublicPortfolios()
      .then((data) => { if (active) { setAll(data); setError(false); } })
      .catch(() => { if (active) setError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  // Everything except the category selection — used for the card grid and per-category counts.
  const preCategory = useMemo(() => {
    const q = filters.keyword.trim().toLowerCase();
    return all.filter((p) => {
      if (q && !(
        p.owner.name.toLowerCase().includes(q) ||
        p.headline.toLowerCase().includes(q) ||
        p.owner.location.toLowerCase().includes(q) ||
        p.serviceAreas.some((a) => a.toLowerCase().includes(q))
      )) return false;
      if (filters.district && !p.serviceAreas.includes(filters.district)) return false;
      if (filters.verifiedOnly && !p.owner.verified) return false;
      if (filters.languages.length && !filters.languages.every((l) => p.languages.includes(l))) return false;
      return true;
    });
  }, [all, filters]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: preCategory.length };
    for (const cat of CATEGORY_ORDER) c[cat] = preCategory.filter((p) => p.category === cat).length;
    return c;
  }, [preCategory]);

  const results = useMemo(() => {
    let list = category === "all" ? preCategory : preCategory.filter((p) => p.category === category);

    // Category-specific filters (only when a category is selected).
    if (category !== "all") {
      const fieldMap = new Map(catFields.map((f) => [f.key, f]));
      list = list.filter((pro) =>
        Object.entries(filters.extra).every(([key, vals]) => {
          if (!vals.length) return true;
          const field = fieldMap.get(key);
          if (!field) return true;
          const dv = pro.details[key];
          if (field.type === "toggle") return !!dv;
          if (field.type === "chip-multiselect") return Array.isArray(dv) && vals.some((v) => (dv as string[]).includes(v));
          return dv != null && vals.includes(String(dv));
        })
      );
    }

    list = [...list];
    if (filters.sort === "experience") list.sort((a, b) => (b.experienceYears ?? 0) - (a.experienceYears ?? 0));
    else if (filters.sort === "name") list.sort((a, b) => a.owner.name.localeCompare(b.owner.name));
    else list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [preCategory, category, catFields, filters.extra, filters.sort]);

  const CatIcon = category !== "all" ? CATEGORY_ICON[category] : FALLBACK_ICON;

  // Removable pills summarising every active filter (shown above the results).
  const activePills: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.district) activePills.push({ key: "district", label: filters.district, onRemove: () => update({ district: "" }) });
  filters.languages.forEach((l) => activePills.push({ key: `lang:${l}`, label: l, onRemove: () => update({ languages: filters.languages.filter((x) => x !== l) }) }));
  if (filters.verifiedOnly) activePills.push({ key: "verified", label: "Verified only", onRemove: () => update({ verifiedOnly: false }) });
  Object.entries(filters.extra).forEach(([k, vals]) => {
    if (!vals.length) return;
    const field = catFields.find((f) => f.key === k);
    if (!field) return;
    if (field.type === "toggle") activePills.push({ key: k, label: field.label, onRemove: () => toggleExtraBool(k) });
    else vals.forEach((v) => activePills.push({ key: `${k}:${v}`, label: v, onRemove: () => toggleExtra(k, v) }));
  });

  const professionCards = [
    { id: "all" as CategoryFilter, label: "All", Icon: LayoutGrid },
    ...CATEGORY_ORDER.map((c) => ({ id: c as CategoryFilter, label: CATEGORY_PLURAL[c], Icon: CATEGORY_ICON[c] })),
  ];

  return (
    <div className="relative flex min-h-screen flex-col font-sans">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1b120a] via-[#2b1c0d] to-[#3a2415]" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_0%,rgba(176,91,51,0.35),transparent_55%)]" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-9 pt-10 sm:px-6 sm:pb-11 sm:pt-14">
          <nav className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold text-white/60">
            <Link href="/" className="transition-colors hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{crumb ?? "Professionals"}</span>
          </nav>
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-7" style={{ backgroundColor: ACCENT }} />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#F2D9A8]">{eyebrow ?? "NirMix • Professionals"}</span>
          </div>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {title ?? "Find trusted professionals"}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/70 sm:text-base">
            {subtitle ?? "Verified engineers, architects, agents, interior designers and contractors across Nepal — browse profiles and reach out directly."}
          </p>

          {/* Search pill */}
          <div className="mt-5 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <input
                value={filters.keyword}
                onChange={(e) => update({ keyword: e.target.value })}
                placeholder="Search by name, skill or district…"
                className="w-full rounded-xl bg-white/0 py-2.5 pl-9 pr-3 text-sm font-medium text-white placeholder-white/55 outline-none"
              />
            </div>
            <div className="relative sm:w-48">
              <select
                value={filters.district}
                onChange={(e) => update({ district: e.target.value })}
                className="w-full cursor-pointer appearance-none rounded-xl bg-white/95 py-2.5 pl-3 pr-9 text-sm font-semibold text-[#342417] outline-none"
              >
                <option value="">All districts</option>
                {ALL_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#342417]/50" />
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Profession cards */}
        <div className="mb-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6">
          {professionCards.map(({ id, label, Icon }) => {
            const active = category === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => selectCategory(id)}
                style={active ? { borderColor: ACCENT, backgroundColor: `${ACCENT}0f` } : undefined}
                className={`group relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                  active ? "shadow-[0_12px_26px_-14px_rgba(52,36,23,0.5)]" : "border-mist bg-white/80 hover:border-[#342417]/20"
                }`}
              >
                <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: active ? ACCENT : `${ACCENT}14`, color: active ? "#fff" : ACCENT }}>
                  <Icon className="h-4 w-4" />
                </span>
                <span className="relative min-w-0">
                  <span className="block truncate text-[13px] font-bold leading-tight text-[#342417]">{label}</span>
                  <span className="block text-[11px] font-semibold leading-tight" style={{ color: active ? ACCENT : "rgba(92,77,60,0.6)" }}>
                    {counts[id] ?? 0} pro{(counts[id] ?? 0) === 1 ? "" : "s"}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[288px_1fr] lg:gap-8">
          {/* Sidebar filters */}
          <aside className="w-full min-w-0">
            <div className="overflow-hidden rounded-3xl border border-mist bg-white/85 shadow-[0_18px_50px_-22px_rgba(52,36,23,0.35)] backdrop-blur-md lg:sticky lg:top-24">
              <div className="flex items-center justify-between gap-2 px-5 py-4" style={{ background: `linear-gradient(180deg, ${ACCENT}10, transparent)` }}>
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm" style={{ backgroundColor: ACCENT, color: "#fff" }}>
                    <SlidersHorizontal className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-extrabold leading-none text-[#342417]">Refine</p>
                    <p className="mt-1.5 text-[11px] text-[#5C4D3C]/60">
                      <span className="font-bold" style={{ color: ACCENT }}>{results.length}</span> match{results.length !== 1 ? "es" : ""}
                    </p>
                  </div>
                </div>
                {activePills.length > 0 && (
                  <button type="button" onClick={reset} className="flex items-center gap-1 rounded-lg border border-mist bg-white/70 px-2.5 py-1.5 text-[11px] font-bold text-[#5C4D3C]/70 transition-colors hover:border-[#342417]/20 hover:text-[#342417]">
                    <RotateCcw className="h-3 w-3" /> Clear {activePills.length}
                  </button>
                )}
              </div>

              <div className="space-y-6 px-5 py-5">
                {/* Contextual, category-specific filters — the most relevant, up top */}
                {category !== "all" ? (
                  catFields.length > 0 && (
                    <div className="rounded-2xl border p-4 transition-shadow duration-300 hover:shadow-[0_10px_30px_-18px_rgba(176,91,51,0.6)]" style={{ borderColor: `${ACCENT}30`, background: `${ACCENT}0a` }}>
                      <div className="mb-4 flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg shadow-sm" style={{ backgroundColor: ACCENT, color: "#fff" }}>
                          <CatIcon className="h-3.5 w-3.5" />
                        </span>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em]" style={{ color: ACCENT }}>
                          {CATEGORY_PLURAL[category]}
                        </p>
                      </div>
                      <div className="space-y-4">
                        {catFields.map((f) =>
                          f.type === "toggle" ? (
                            <div key={f.key} className="flex items-center justify-between gap-3 rounded-lg bg-white/60 px-3 py-2">
                              <span className="text-xs font-semibold text-[#342417]">{f.label}</span>
                              <Toggle on={extraOf(f.key).length > 0} onClick={() => toggleExtraBool(f.key)} />
                            </div>
                          ) : (
                            <FilterGroup key={f.key} label={f.label} count={extraOf(f.key).length}>
                              {f.options?.map((opt) => (
                                <Chip key={opt} label={opt} active={extraOf(f.key).includes(opt)} onClick={() => toggleExtra(f.key, opt)} />
                              ))}
                            </FilterGroup>
                          )
                        )}
                      </div>
                    </div>
                  )
                ) : (
                  <div className="rounded-2xl border border-dashed border-mist bg-sand/30 px-4 py-3.5 text-[11.5px] leading-relaxed text-[#5C4D3C]/70">
                    Pick a profession above to filter by services, specialisation and more.
                  </div>
                )}

                <FilterGroup label="Languages" count={filters.languages.length}>
                  {LANGUAGE_OPTIONS.map((l) => (
                    <Chip
                      key={l}
                      label={l}
                      active={filters.languages.includes(l)}
                      onClick={() => update({ languages: filters.languages.includes(l) ? filters.languages.filter((x) => x !== l) : [...filters.languages, l] })}
                    />
                  ))}
                </FilterGroup>

                {/* Verified only */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-mist bg-sand/30 px-3.5 py-3 transition-colors hover:border-[#342417]/15 hover:bg-sand/50">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#342417]">
                    <BadgeCheck className="h-4 w-4 text-[#157A74]" /> Verified only
                  </span>
                  <Toggle on={filters.verifiedOnly} onClick={() => update({ verifiedOnly: !filters.verifiedOnly })} />
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="min-w-0 flex-1">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist bg-white/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm text-[#5C4D3C]">
                <span className="font-extrabold text-[#342417]">{results.length}</span> professional{results.length === 1 ? "" : "s"}
                {category !== "all" ? ` · ${CATEGORY_PLURAL[category]}` : ""}
              </p>
              <div className="relative">
                <select value={filters.sort} onChange={(e) => update({ sort: e.target.value as Filters["sort"] })}
                  className="cursor-pointer appearance-none rounded-xl border border-mist bg-sand/60 py-2 pl-3 pr-9 text-xs font-bold text-[#342417] outline-none focus:border-[#342417]/30">
                  {Object.entries(SORT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C4D3C]/50" />
              </div>
            </div>

            {/* Active filter pills */}
            {activePills.length > 0 && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {activePills.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={p.onRemove}
                    className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-white px-3 py-1.5 text-[11px] font-bold text-[#342417] shadow-sm transition hover:border-[#B05B33]/40 hover:text-[#B05B33]"
                  >
                    {p.label}
                    <X className="h-3 w-3" />
                  </button>
                ))}
                <button type="button" onClick={reset} className="ml-1 text-[11px] font-bold text-[#5C4D3C]/60 underline-offset-2 transition hover:text-[#342417] hover:underline">
                  Clear all
                </button>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-mist bg-white/60 px-6 py-20 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
                  <SearchX className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-extrabold text-[#342417]">Couldn’t load professionals</h3>
                <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">Please check your connection and try again.</p>
              </div>
            ) : results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((pro) => <ProfessionalCard key={pro.id} pro={pro} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-mist bg-white/60 px-6 py-20 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
                  <SearchX className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-extrabold text-[#342417]">No professionals match your filters</h3>
                <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">Try clearing a filter or widening your search to see more people.</p>
                <button type="button" onClick={reset} className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#342417] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#251910]">
                  Clear all filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
