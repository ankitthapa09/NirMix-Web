"use client";

import { useState } from "react";
import { Search, MapPin, Home, IndianRupee } from "lucide-react";

const tabs = ["All", "Rent", "Sell"] as const;

export function SearchConsole() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("All");

  return (
    <section className="relative z-20 -mt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-2xl border border-mist bg-paper p-4 shadow-xl sm:p-6">
          {/* Tabs */}
          <div className="mb-4 flex gap-1 border-b border-mist/50 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all sm:text-sm ${
                  activeTab === tab
                    ? "bg-ember text-white shadow-md"
                    : "text-slate hover:bg-sand"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Filter Row */}
          <div className="grid grid-cols-1 items-center gap-3 sm:grid-cols-12">
            {/* Location */}
            <div className="relative sm:col-span-4">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
              <input
                type="text"
                placeholder="Location"
                className="w-full rounded-xl border border-mist/70 bg-sand/30 py-3 pl-9 pr-4 text-sm text-ink placeholder:text-slate/50 transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember"
              />
            </div>

            {/* Property Type */}
            <div className="relative sm:col-span-3">
              <Home className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
              <select className="w-full appearance-none rounded-xl border border-mist/70 bg-sand/30 py-3 pl-9 pr-8 text-sm text-ink transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember">
                <option value="">Property Type ▾</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Apartment">Apartment</option>
              </select>
            </div>

            {/* Price Range */}
            <div className="relative sm:col-span-3">
              <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate/50" />
              <select className="w-full appearance-none rounded-xl border border-mist/70 bg-sand/30 py-3 pl-9 pr-8 text-sm text-ink transition-all focus:border-ember focus:outline-hidden focus:ring-1 focus:ring-ember">
                <option value="">Price Range ▾</option>
                <option value="under-6000000">Under ₹60 Lakh</option>
                <option value="6000000-12000000">₹60L – ₹1.2 Cr</option>
                <option value="12000000-20000000">₹1.2 Cr – ₹2 Cr</option>
                <option value="20000000-plus">₹2 Cr+</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="flex items-center justify-center gap-2 rounded-xl bg-jade px-4 py-3 text-sm font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-jade/90 sm:col-span-2">
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
