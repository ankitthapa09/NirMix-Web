"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { dashboardFeedProperties } from "@/lib/mock-data";
import { DashboardPropertyCard } from "./DashboardPropertyCard";

type FilterTab = "All" | "Buy" | "Rent";

export function PropertyFeed() {
  const [activeTab, setActiveTab] = useState<FilterTab>("All");

  const filteredProperties = dashboardFeedProperties.filter((p) => {
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {filteredProperties.map((property) => (
          <DashboardPropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  );
}
