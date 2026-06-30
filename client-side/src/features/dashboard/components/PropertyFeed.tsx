"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { fetchProperties } from "@/lib/property-api";
import type { Property } from "@/types/property";
import { DashboardPropertyCard } from "./DashboardPropertyCard";

type FilterTab = "All" | "Buy" | "Rent";

export function PropertyFeed() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const list = await fetchProperties();
        if (active) setProperties(list);
      } catch {
        // Network/API error — show the empty state.
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const filteredProperties = properties.filter((p) => {
    if (activeTab === "All") return true;
    if (activeTab === "Buy") return p.status === "For Sale";
    if (activeTab === "Rent") return p.status === "For Rent";
    return true;
  });

  const tabs: FilterTab[] = ["All", "Buy", "Rent"];

  return (
    <section>
      {/* Header Row */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-extrabold text-[#342417]">
          Property feed
        </h2>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === tab
                  ? "bg-[#5A7A50] text-white shadow-sm"
                  : "bg-white text-[#5C4D3C]/70 border border-[#E0D4C5] hover:border-[#5A7A50]/30 hover:text-[#342417]"
              }`}
            >
              {tab}
            </button>
          ))}

          <button
            type="button"
            className="flex items-center gap-1.5 rounded-lg border border-[#E0D4C5] bg-white px-3 py-1.5 text-xs font-semibold text-[#5C4D3C]/70 transition hover:border-[#5A7A50]/30 hover:text-[#342417] cursor-pointer"
          >
            <SlidersHorizontal className="h-3 w-3" />
            Filters
          </button>
        </div>
      </div>

      {/* Property Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-[#E0D4C5]/60 bg-white">
              <div className="h-48 w-full animate-pulse bg-[#EFE7D8]" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-[#EFE7D8]" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-[#EFE7D8]" />
                <div className="h-5 w-1/3 animate-pulse rounded bg-[#EFE7D8]" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filteredProperties.map((property) => (
            <DashboardPropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D4C5] bg-white/60 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-[#342417]">No properties to show yet</p>
          <p className="mt-1 text-xs text-[#5C4D3C]/65">
            New verified listings will appear here as they&apos;re published.
          </p>
        </div>
      )}
    </section>
  );
}
