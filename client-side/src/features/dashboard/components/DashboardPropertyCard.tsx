"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, MapPin, BedDouble, Bath, Maximize2, ArrowRight, Star } from "lucide-react";
import type { Property } from "@/types/property";
import { useSaved } from "@/lib/saved-context";

interface DashboardPropertyCardProps {
  property: Property;
}

function formatPrice(price: number, status: string): string {
  if (status === "For Rent") {
    return `NPR ${price.toLocaleString("en-IN")} / mo`;
  }
  if (price >= 10000000) {
    return `NPR ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Cr`;
  }
  if (price >= 100000) {
    return `NPR ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} Lakh`;
  }
  return `NPR ${price.toLocaleString("en-IN")}`;
}

export function DashboardPropertyCard({ property }: DashboardPropertyCardProps) {
  const { isSaved, toggleSave } = useSaved();
  const saved = isSaved(property.id);

  const statusLabel = property.status === "For Sale" ? "BUY" : "RENT";
  const statusColor =
    property.status === "For Sale"
      ? "bg-[#5A7A50] text-white"
      : "bg-[#C4A96A] text-[#342417]";

  const tagColor = {
    NEW: "bg-[#FFC529] text-[#342417]",
    VERIFIED: "bg-[#5A7A50] text-white",
    HOT: "bg-[#D94F3B] text-white",
  };

  const areaLabel =
    property.areaUnit === "Aana"
      ? `${property.areaSqft} Aana`
      : `${property.areaSqft.toLocaleString()} sqft`;

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-[#E0D4C5]/60">
      {/* Image */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={property.photos[0]}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />

        {/* Tags - top left */}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${statusColor}`}
          >
            {statusLabel}
          </span>
          {property.tag && (
            <span
              className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${tagColor[property.tag]}`}
            >
              {property.tag}
            </span>
          )}
        </div>

        {/* Heart - top right */}
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleSave(property); }}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm backdrop-blur-sm transition cursor-pointer ${
            saved ? "bg-white text-red-500" : "bg-white/80 text-[#342417]/60 hover:bg-white hover:text-red-500"
          }`}
          aria-label={saved ? "Remove from saved" : "Save property"}
          aria-pressed={saved}
        >
          <Heart className={`h-4 w-4 transition-transform ${saved ? "scale-110 fill-red-500" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-sm font-bold text-[#342417] leading-tight">
          {property.title}
        </h3>

        {/* Location */}
        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#5C4D3C]/70">
          <MapPin className="h-3 w-3 shrink-0" />
          <span>
            {property.location.neighborhood}, {property.location.city}
          </span>
        </div>

        {/* Rating — only once the listing has been reviewed */}
        {(property.ratingCount ?? 0) > 0 && (
          <div className="mt-2 flex items-center gap-1 text-[11px]">
            <Star className="h-3.5 w-3.5 fill-[#E5A93A] text-[#E5A93A]" />
            <span className="font-bold text-[#342417]">
              {(property.ratingAverage ?? 0).toFixed(1)}
            </span>
            <span className="text-[#5C4D3C]/60">
              ({property.ratingCount} review{property.ratingCount === 1 ? "" : "s"})
            </span>
          </div>
        )}

        {/* Specs Row */}
        {property.type !== "Land" ? (
          <div className="mt-3 flex items-center gap-4 text-[11px] text-[#5C4D3C]/80">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5" />
              {property.beds}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" />
              {property.baths}
            </span>
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3.5 w-3.5" />
              {areaLabel}
            </span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1 text-[11px] text-[#5C4D3C]/80">
            <Maximize2 className="h-3.5 w-3.5" />
            <span>{areaLabel}</span>
          </div>
        )}

        {/* Price + View */}
        <div className="mt-4 flex items-end justify-between">
          <p className="text-base font-extrabold text-[#342417]">
            {formatPrice(property.price, property.status)}
          </p>
          <Link
            href={`/properties/${property.id}`}
            className="flex items-center gap-1 text-[11px] font-bold text-[#5A7A50] transition hover:text-[#4A6A40]"
          >
            View <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
