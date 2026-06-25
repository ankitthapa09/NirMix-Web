"use client";

import { useState } from "react";
import { Search, MapPin, Home, Tag, Key, User, FileText } from "lucide-react";

export function SearchConsole() {
  const [activeTab, setActiveTab] = useState<"Buy" | "Rent" | "Agents" | "Tenders">("Buy");

  return (
    <section className="relative z-20 -mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-2xl bg-[#E6D8C8] p-5 md:p-6 shadow-xl border border-white/10">
          
          {/* Tabs Row */}
          <div className="mb-4 flex flex-wrap gap-4 items-center px-2">
            {/* Buy Tab */}
            <button
              onClick={() => setActiveTab("Buy")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "Buy"
                  ? "bg-[#6BB870] text-white"
                  : "text-[#342417] hover:bg-[#342417]/5"
              }`}
            >
              <Home className="h-3.5 w-3.5" />
              <span>Buy</span>
            </button>

            {/* Rent Tab */}
            <button
              onClick={() => setActiveTab("Rent")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "Rent"
                  ? "bg-[#6BB870] text-white"
                  : "text-[#342417] hover:bg-[#342417]/5"
              }`}
            >
              <Key className="h-3.5 w-3.5" />
              <span>Rent</span>
            </button>

            {/* Agents Tab */}
            <button
              onClick={() => setActiveTab("Agents")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "Agents"
                  ? "bg-[#6BB870] text-white"
                  : "text-[#342417] hover:bg-[#342417]/5"
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Agents</span>
            </button>

            {/* Tenders Tab */}
            <button
              onClick={() => setActiveTab("Tenders")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                activeTab === "Tenders"
                  ? "bg-[#6BB870] text-white"
                  : "text-[#342417] hover:bg-[#342417]/5"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>Tenders</span>
            </button>
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 items-center gap-3 md:grid-cols-12 bg-transparent">
            {/* Location */}
            <div className="relative md:col-span-4">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/60" />
              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-lg border-0 bg-white py-3 pl-9 pr-4 text-xs font-semibold text-ink placeholder:text-slate/60 focus:outline-hidden focus:ring-1 focus:ring-[#342417]"
              />
            </div>

            {/* Property Type */}
            <div className="relative md:col-span-3">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/60 pointer-events-none" />
              <select className="w-full appearance-none rounded-lg border-0 bg-white py-3 pl-9 pr-8 text-xs font-semibold text-ink focus:outline-hidden focus:ring-1 focus:ring-[#342417]">
                <option value="">Property Type</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Apartment">Apartment</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate/60 pointer-events-none">▼</span>
            </div>

            {/* Price Range */}
            <div className="relative md:col-span-3">
              <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/60 pointer-events-none" />
              <select className="w-full appearance-none rounded-lg border-0 bg-white py-3 pl-9 pr-8 text-xs font-semibold text-ink focus:outline-hidden focus:ring-1 focus:ring-[#342417]">
                <option value="">Price Range</option>
                <option value="under-6000000">Under NPR 60 Lakh</option>
                <option value="6000000-12000000">NPR 60L – 1.2 Cr</option>
                <option value="12000000-20000000">NPR 1.2 Cr – 2 Cr</option>
                <option value="20000000-plus">NPR 2 Cr+</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate/60 pointer-events-none">▼</span>
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center gap-2 rounded-lg bg-[#342417] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#251910] hover:-translate-y-0.5 md:col-span-2 cursor-pointer">
              <Search className="h-3.5 w-3.5" />
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
