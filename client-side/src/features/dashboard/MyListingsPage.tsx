"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Home, AlertCircle, RotateCw, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { MyListingCard, type ApiProperty } from "./components/MyListingCard";

type Tab = "all" | "sale" | "rent";

const API_BASE = "http://localhost:5001/api";

export function MyListingsPage() {
  const { accessToken, isLoading: authLoading } = useAuth();
  const [listings, setListings] = useState<ApiProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("all");
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<ApiProperty | null>(null);
  const [deleting, setDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deleteTarget || !accessToken) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/properties/${deleteTarget._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to delete listing.");
        return;
      }
      setListings((prev) => prev.filter((p) => p._id !== deleteTarget._id));
      toast.success("Listing deleted.");
      setDeleteTarget(null);
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (authLoading) return; // wait for auth to hydrate from storage
    let active = true;

    const run = async () => {
      if (!accessToken) {
        if (active) {
          setLoading(false);
          setError("Please log in to view your listings.");
        }
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/properties/me`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await res.json();
        if (!active) return;
        if (!res.ok) {
          setError(json.message || "Failed to load your listings.");
          return;
        }
        setListings(json.data ?? []);
      } catch {
        if (active) setError("Network error. Please try again.");
      } finally {
        if (active) setLoading(false);
      }
    };

    run();
    return () => {
      active = false;
    };
  }, [accessToken, authLoading, refreshKey]);

  const counts = {
    all: listings.length,
    sale: listings.filter((p) => p.listingType === "For Sale").length,
    rent: listings.filter((p) => p.listingType === "For Rent").length,
  };

  const filtered = listings.filter((p) =>
    tab === "all" ? true : tab === "sale" ? p.listingType === "For Sale" : p.listingType === "For Rent"
  );

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "sale", label: "For Sale" },
    { key: "rent", label: "For Rent" },
  ];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="h-[2px] w-5 bg-[#5A7A50]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A7A50]">Dashboard</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#342417] sm:text-3xl">My Listings</h1>
          <p className="mt-1 text-sm font-medium text-[#5C4D3C]/70">
            {loading ? "Loading your properties…" : `${counts.all} ${counts.all === 1 ? "property" : "properties"} listed`}
          </p>
        </div>

        <Link
          href="/dashboard/properties/create"
          className="inline-flex w-fit items-center gap-1.5 rounded-xl bg-[#342417] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#251910]"
        >
          <Plus className="h-4 w-4" /> Post a Property
        </Link>
      </div>

      {/* Tabs */}
      {!loading && !error && listings.length > 0 && (
        <div className="mt-6 flex items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                tab === t.key
                  ? "bg-[#5A7A50] text-white shadow-sm"
                  : "border border-[#E0D4C5] bg-white text-[#5C4D3C]/70 hover:border-[#5A7A50]/30 hover:text-[#342417]"
              }`}
            >
              {t.label} <span className="opacity-70">({counts[t.key]})</span>
            </button>
          ))}
        </div>
      )}

      {/* Body */}
      <div className="mt-6">
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
        ) : listings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <MyListingCard
                key={p._id}
                property={p}
                onEdit={() => toast.info("Editing listings is coming soon.")}
                onDelete={() => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDeleteModal
          property={deleteTarget}
          deleting={deleting}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function ConfirmDeleteModal({
  property,
  deleting,
  onCancel,
  onConfirm,
}: {
  property: ApiProperty;
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={deleting ? undefined : onCancel}
        aria-hidden="true"
      />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-[#E8DECF] bg-white p-6 shadow-2xl">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500">
            <Trash2 className="h-6 w-6" />
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold text-[#342417]">Delete this listing?</h3>
            <p className="mt-1 text-sm text-[#5C4D3C]/75">
              <span className="font-bold text-[#342417]">{property.title}</span>{" "}
              <span className="font-mono text-xs text-[#5C4D3C]/60">({property.referenceId})</span> will be
              permanently removed, including its photos. This can&apos;t be undone.
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            className="rounded-xl border border-[#E0D4C5] bg-white px-4 py-2.5 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25 disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-red-700 disabled:opacity-70 cursor-pointer"
          >
            {deleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" /> Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-[#E0D4C5]/70 bg-white">
          <div className="h-52 w-full animate-pulse bg-[#EFE7D8]" />
          <div className="space-y-3 p-4">
            <div className="h-4 w-3/4 animate-pulse rounded bg-[#EFE7D8]" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-[#EFE7D8]" />
            <div className="flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-lg bg-[#EFE7D8]" />
              <div className="h-6 w-16 animate-pulse rounded-lg bg-[#EFE7D8]" />
            </div>
            <div className="h-5 w-1/3 animate-pulse rounded bg-[#EFE7D8]" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#5A7A50]/10 text-[#5A7A50]">
        <Home className="h-7 w-7" />
      </span>
      <h3 className="mt-4 text-lg font-extrabold text-[#342417]">No listings yet</h3>
      <p className="mt-1 max-w-sm text-sm text-[#5C4D3C]/70">
        Your published properties will appear here. Post your first property to reach thousands of verified buyers and renters.
      </p>
      <Link
        href="/dashboard/properties/create"
        className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#342417] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#251910]"
      >
        <Plus className="h-4 w-4" /> Post a Property
      </Link>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-[#E0D4C5] bg-white px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
        <AlertCircle className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-semibold text-[#342417]">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-white px-4 py-2 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer"
        >
          <RotateCw className="h-4 w-4" /> Try again
        </button>
      )}
    </div>
  );
}
