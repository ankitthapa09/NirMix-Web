"use client";

import Link from "next/link";
import { Heart, Search, ArrowRight, LogIn } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useSaved } from "@/lib/saved-context";
import { DashboardPropertyCard } from "./components/DashboardPropertyCard";

const ACCENT = "#B05B33";

function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E0D4C5]/60 bg-white">
      <div className="h-48 w-full animate-pulse bg-[#EFE7D8]" />
      <div className="space-y-3 p-4">
        <div className="h-4 w-3/4 animate-pulse rounded bg-[#EFE7D8]" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-[#EFE7D8]" />
        <div className="h-5 w-1/3 animate-pulse rounded bg-[#EFE7D8]" />
      </div>
    </div>
  );
}

export function SavedPropertiesPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { saved, loading } = useSaved();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="h-[2px] w-5 bg-[#B05B33]" />
          <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B05B33]">Your shortlist</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#342417] sm:text-3xl">Saved Properties</h1>
        <p className="mt-1 text-sm text-[#5C4D3C]/70">
          {saved.length > 0 ? `${saved.length} propert${saved.length === 1 ? "y" : "ies"} you’ve shortlisted.` : "Tap the heart on any listing to save it here."}
        </p>
      </div>

      {authLoading || loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : !isAuthenticated ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
            <LogIn className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-extrabold text-[#342417]">Log in to see your saved properties</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">Save listings you love and pick up right where you left off.</p>
          <Link href="/login" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#342417] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#251910]">
            Log in <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      ) : saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-20 text-center">
          <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
            <Heart className="h-7 w-7" />
          </span>
          <h3 className="text-lg font-extrabold text-[#342417]">No saved properties yet</h3>
          <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">
            Browse listings and tap the heart to build your shortlist — it’ll show up here.
          </p>
          <Link href="/properties" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#B05B33] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#9a4c28]">
            <Search className="h-4 w-4" /> Browse properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {saved.map((property) => (
            <DashboardPropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}
