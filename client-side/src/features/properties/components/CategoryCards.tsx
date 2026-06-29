"use client";

import { Home, Building2, Building, Map, BedDouble, Briefcase, Store, LayoutGrid } from "lucide-react";
import type { CategoryOption } from "../types";

const CATEGORY_ICONS: Record<string, typeof Home> = {
  House: Home,
  Apartment: Building2,
  Land: Map,
  Flats: Building,
  Room: BedDouble,
  "Office Space": Briefcase,
  "Shop Space": Store,
};

interface CategoryCardsProps {
  categories: CategoryOption[];
  counts: Record<string, number>;
  selected: string;
  onSelect: (category: string) => void;
  accent: string;
  total: number;
}

export function CategoryCards({
  categories,
  counts,
  selected,
  onSelect,
  accent,
  total,
}: CategoryCardsProps) {
  const cards = [
    { id: "", label: "All", Icon: LayoutGrid, count: total },
    ...categories.map((c) => ({
      id: c.value,
      label: c.label,
      Icon: CATEGORY_ICONS[c.value] ?? Home,
      count: counts[c.value] ?? 0,
    })),
  ];

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-[repeat(auto-fill,minmax(150px,1fr))]">
      {cards.map(({ id, label, Icon, count }) => {
        const active = selected === id;
        return (
          <button
            key={id || "all"}
            type="button"
            onClick={() => onSelect(active ? "" : id)}
            style={active ? { borderColor: accent, backgroundColor: `${accent}0f` } : undefined}
            className={`group relative flex items-center gap-2.5 overflow-hidden rounded-xl border px-3 py-2.5 text-left transition-all duration-300 cursor-pointer hover:-translate-y-0.5 ${
              active
                ? "shadow-[0_12px_26px_-14px_rgba(52,36,23,0.5)]"
                : "border-mist bg-white/80 hover:border-[#342417]/20 hover:shadow-[0_12px_26px_-16px_rgba(52,36,23,0.45)]"
            }`}
          >
            {/* hover sheen sweep */}
            <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/55 to-transparent transition-all duration-700 group-hover:left-full" />

            <span
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
              style={{ backgroundColor: active ? accent : `${accent}14`, color: active ? "#fff" : accent }}
            >
              <Icon className="h-4 w-4" />
            </span>

            <span className="relative min-w-0">
              <span className="block truncate text-[13px] font-bold leading-tight text-[#342417]">
                {label}
              </span>
              <span
                className="block text-[11px] font-semibold leading-tight"
                style={{ color: active ? accent : "rgba(92,77,60,0.6)" }}
              >
                {count} listing{count !== 1 ? "s" : ""}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
