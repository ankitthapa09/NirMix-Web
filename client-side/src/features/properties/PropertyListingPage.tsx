"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  ChevronDown,
  ChevronRight,
  MapPin,
  SearchX,
} from "lucide-react";

import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { DashboardPropertyCard } from "@/features/dashboard/components/DashboardPropertyCard";
import { getListingsByStatus, allProperties } from "@/lib/mock-data";
import type { Property } from "@/types/property";
import { PropertyFilters } from "./components/PropertyFilters";
import { CategoryCards } from "./components/CategoryCards";
import {
  ListingFilters,
  ListingMode,
  ListingStatusFilter,
  EMPTY_FILTERS,
  DISTRICT_OPTIONS,
  CATEGORIES,
} from "./types";

interface PropertyListingPageProps {
  mode: ListingMode;
  initialType?: string;
  initialStatus?: ListingStatusFilter;
}

const COPY: Record<ListingMode, { eyebrow: string; title: string; subtitle: string; bg: string; status: Property["status"] }> = {
  buy: {
    eyebrow: "NirMix • Buy",
    title: "Properties for Sale",
    subtitle: "Find a home, apartment or plot to own across Nepal — verified listings only.",
    bg: "/images/sell-house-bg.png",
    status: "For Sale",
  },
  rent: {
    eyebrow: "NirMix • Rent",
    title: "Properties for Rent",
    subtitle: "Discover rentals that fit your lifestyle and budget, move-in ready.",
    bg: "/images/rent-house-bg.avif",
    status: "For Rent",
  },
  all: {
    eyebrow: "NirMix • Properties",
    title: "Explore Every Property",
    subtitle: "One place for every verified home, apartment, plot and rental across Nepal.",
    bg: "/images/allpropertypage-bg.jpg",
    status: "For Sale",
  },
};

const SORT_LABELS: Record<ListingFilters["sort"], string> = {
  newest: "Newest first",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
};

export function PropertyListingPage({ mode, initialType, initialStatus }: PropertyListingPageProps) {
  const copy = COPY[mode];
  const accent = mode === "rent" ? "#157A74" : "#B05B33";
  const resultNoun =
    mode === "buy"
      ? { one: "home", many: "homes" }
      : mode === "rent"
        ? { one: "rental", many: "rentals" }
        : { one: "property", many: "properties" };

  const data = useMemo(
    () => (mode === "all" ? allProperties : getListingsByStatus(copy.status)),
    [mode, copy.status]
  );

  const validInitialCategory =
    initialType && CATEGORIES[mode].some((c) => c.value === initialType) ? initialType : "";

  const [filters, setFilters] = useState<ListingFilters>({
    ...EMPTY_FILTERS,
    category: validInitialCategory,
    listingType: mode === "all" && initialStatus ? initialStatus : "all",
  });

  const update = (next: Partial<ListingFilters>) =>
    setFilters((prev) => ({ ...prev, ...next }));
  const reset = () => setFilters({ ...EMPTY_FILTERS });

  const results = useMemo(() => {
    let list = [...data];
    const kw = filters.keyword.trim().toLowerCase();

    if (filters.listingType !== "all") {
      const wanted = filters.listingType === "sale" ? "For Sale" : "For Rent";
      list = list.filter((p) => p.status === wanted);
    }
    if (kw) {
      list = list.filter((p) =>
        [p.title, p.location.neighborhood, p.location.city, p.location.district]
          .join(" ")
          .toLowerCase()
          .includes(kw)
      );
    }
    if (filters.category) {
      list = list.filter((p) => p.type === filters.category);
    }
    if (filters.minPrice) list = list.filter((p) => p.price >= Number(filters.minPrice));
    if (filters.maxPrice) list = list.filter((p) => p.price <= Number(filters.maxPrice));
    if (filters.beds) {
      const min = Number(filters.beds.replace("+", ""));
      list = list.filter((p) => (filters.beds.includes("+") ? p.beds >= min : p.beds === min));
    }
    if (filters.baths) {
      const min = Number(filters.baths.replace("+", ""));
      list = list.filter((p) => (filters.baths.includes("+") ? p.baths >= min : p.baths === min));
    }
    if (filters.district) list = list.filter((p) => p.location.district === filters.district);
    if (filters.minArea) {
      const min = Number(filters.minArea);
      // Area filter targets sqft listings; Aana-measured plots use a different unit, so keep them.
      list = list.filter((p) => p.areaUnit === "Aana" || p.areaSqft >= min);
    }

    if (filters.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (filters.sort === "price-desc") list.sort((a, b) => b.price - a.price);

    return list;
  }, [data, filters]);

  // Per-category counts respect the active status (Buy/Rent) but ignore the
  // selected category, so each card shows how many listings it would reveal.
  const { categoryCounts, statusTotal } = useMemo(() => {
    const base =
      filters.listingType === "all"
        ? data
        : data.filter(
            (p) => p.status === (filters.listingType === "sale" ? "For Sale" : "For Rent")
          );
    const counts: Record<string, number> = {};
    for (const c of CATEGORIES[mode]) {
      counts[c.value] = base.filter((p) => p.type === c.value).length;
    }
    return { categoryCounts: counts, statusTotal: base.length };
  }, [data, filters.listingType, mode]);

  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-ember/20 selection:text-ember">
      <Navbar />

      {/* Hero */}
      <section className="relative h-[300px] w-full overflow-hidden md:h-[380px]">
        <Image src={copy.bg} alt="" fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1b120a]/90 via-[#241809]/55 to-[#241809]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_15%_100%,rgba(0,0,0,0.45),transparent_60%)]" />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl flex-col justify-end px-4 pb-8 sm:px-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">
              {mode === "buy" ? "Buy" : mode === "rent" ? "Rent" : "All Properties"}
            </span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="h-[2px] w-7" style={{ backgroundColor: accent }} />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#F2D9A8]">
              {copy.eyebrow}
            </span>
          </div>
          <h1 className="mt-2 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            {copy.title}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/75 sm:text-base">{copy.subtitle}</p>

          {/* Hero search pill */}
          <div className="mt-5 flex w-full max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/10 p-2 backdrop-blur-md sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
              <input
                value={filters.keyword}
                onChange={(e) => update({ keyword: e.target.value })}
                placeholder="Search by title or area…"
                className="w-full rounded-xl bg-white/0 py-2.5 pl-9 pr-3 text-sm font-medium text-white placeholder-white/55 outline-none"
              />
            </div>
            <div className="relative sm:w-44">
              <select
                value={filters.district}
                onChange={(e) => update({ district: e.target.value })}
                className="w-full cursor-pointer appearance-none rounded-xl bg-white/95 py-2.5 pl-3 pr-9 text-sm font-semibold text-[#342417] outline-none"
              >
                <option value="">All districts</option>
                {DISTRICT_OPTIONS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#342417]/50" />
            </div>
            <button
              type="button"
              style={{ backgroundColor: accent }}
              className="flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:brightness-105 active:scale-[0.98] cursor-pointer"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Body */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Status + category selectors */}
        <div className="mb-7 space-y-5">
          {mode === "all" && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#5C4D3C]/60">
                Looking to
              </span>
              <div className="inline-flex rounded-2xl border border-mist bg-white/80 p-1 shadow-sm">
                {([
                  { k: "all", label: "Everything", c: "#342417" },
                  { k: "sale", label: "Buy", c: "#B05B33" },
                  { k: "rent", label: "Rent", c: "#157A74" },
                ] as const).map((opt) => {
                  const active = filters.listingType === opt.k;
                  return (
                    <button
                      key={opt.k}
                      type="button"
                      onClick={() => update({ listingType: opt.k })}
                      style={active ? { backgroundColor: opt.c, color: "#fff" } : undefined}
                      className={`rounded-xl px-5 py-2 text-sm font-extrabold transition cursor-pointer ${
                        active ? "shadow-md" : "text-[#5C4D3C]/70 hover:text-[#342417]"
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <CategoryCards
            categories={CATEGORIES[mode]}
            counts={categoryCounts}
            selected={filters.category}
            onSelect={(category) => update({ category })}
            accent={accent}
            total={statusTotal}
          />
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[296px_1fr] lg:gap-8">
          <PropertyFilters
            mode={mode}
            filters={filters}
            onChange={update}
            onReset={reset}
            resultCount={results.length}
          />

          <section className="min-w-0 flex-1">
            {/* Results header */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-mist bg-white/80 px-4 py-3 backdrop-blur-sm">
              <p className="text-sm text-[#5C4D3C]">
                <span className="font-extrabold text-[#342417]">{results.length}</span>{" "}
                {results.length === 1 ? resultNoun.one : resultNoun.many} found
                {filters.category ? ` in ${filters.category}` : ""}
              </p>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => update({ sort: e.target.value as ListingFilters["sort"] })}
                  className="cursor-pointer appearance-none rounded-xl border border-mist bg-sand/60 py-2 pl-3 pr-9 text-xs font-bold text-[#342417] outline-none focus:border-[#342417]/30"
                >
                  {Object.entries(SORT_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/50" />
              </div>
            </div>

            {/* Results grid */}
            {results.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((property) => (
                  <DashboardPropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-mist bg-white/60 px-6 py-20 text-center">
                <span
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${accent}1a`, color: accent }}
                >
                  <SearchX className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-extrabold text-[#342417]">No properties match your filters</h3>
                <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">
                  Try widening your price range or clearing a few filters to see more listings.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#342417] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#251910] cursor-pointer"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Soft note while only mock data exists */}
            {results.length > 0 && (
              <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-xs text-[#5C4D3C]/55">
                <MapPin className="h-3.5 w-3.5" />
                More verified listings are being added across Nepal.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
