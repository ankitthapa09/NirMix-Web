"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  CalendarDays,
  ImageOff,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

// Shape returned by GET /api/properties/me.
export interface ApiProperty {
  _id: string;
  referenceId: string;
  listingType: "For Sale" | "For Rent";
  propertyType: string;
  status: string;
  title: string;
  description: string;
  location: {
    province: string;
    district: string;
    city: string;
    wardNo: string;
    area: string;
    landmark?: string;
  };
  price: number;
  photos: { url: string; publicId: string }[];
  details: Record<string, unknown>;
  createdAt: string;
}

const str = (v: unknown): string | undefined =>
  v === undefined || v === null || String(v).trim() === "" ? undefined : String(v);

function formatPrice(price: number, listingType: string): string {
  if (listingType === "For Rent") return `NPR ${price.toLocaleString("en-IN")} / mo`;
  if (price >= 10000000) return `NPR ${(price / 10000000).toFixed(price % 10000000 === 0 ? 0 : 2)} Cr`;
  if (price >= 100000) return `NPR ${(price / 100000).toFixed(price % 100000 === 0 ? 0 : 2)} Lakh`;
  return `NPR ${price.toLocaleString("en-IN")}`;
}

interface MyListingCardProps {
  property: ApiProperty;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MyListingCard({ property, onEdit, onDelete }: MyListingCardProps) {
  const isSale = property.listingType === "For Sale";
  const accent = isSale ? "#5A7A50" : "#B0892E";
  const accentSoft = isSale ? "rgba(90,122,80,0.16)" : "rgba(176,137,46,0.16)";

  const cover = property.photos?.[0]?.url;
  const isLand = property.propertyType === "Land";

  const beds = str(property.details.beds);
  const baths = str(property.details.baths);
  const area =
    str(property.details.builtUpArea) ??
    str(property.details.carpetArea) ??
    str(property.details.landArea) ??
    str(property.details.roomSize);

  const posted = new Date(property.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="group relative overflow-hidden rounded-3xl border border-[#E0D4C5]/70 bg-white shadow-[0_2px_10px_-4px_rgba(52,36,23,0.18)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_50px_-22px_rgba(52,36,23,0.45)]"
      style={{ ["--accent" as string]: accent }}
    >
      {/* Accent ring on hover */}
      <span className="pointer-events-none absolute inset-0 z-30 rounded-3xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-2 group-hover:ring-[color:var(--accent)]/40" />

      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden">
        {cover ? (
          <Image
            src={cover}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#F0E5DA] text-[#5C4D3C]/40">
            <ImageOff className="h-8 w-8" />
          </div>
        )}

        {/* Gradient overlays for depth + legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-3 top-3 z-20 flex items-center gap-1.5">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-white shadow-md backdrop-blur-sm"
            style={{ backgroundColor: accent }}
          >
            {isSale ? "For Sale" : "For Rent"}
          </span>
          <span className="rounded-full bg-white/85 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-[#342417] shadow-md backdrop-blur-sm">
            {property.propertyType}
          </span>
        </div>

        {/* Status pill (top-right) */}
        <div className="absolute right-3 top-3 z-20">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
            {property.status}
          </span>
        </div>

        {/* Reference code pill (bottom-left over image) */}
        <span className="absolute bottom-3 left-3 z-20 rounded-md bg-white/15 px-2 py-1 font-mono text-[10px] font-bold tracking-wider text-white shadow-sm ring-1 ring-white/25 backdrop-blur-md">
          {property.referenceId}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="truncate text-sm font-extrabold text-[#342417]">{property.title}</h3>

        <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#5C4D3C]/70">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">
            {property.location.area}, {property.location.city}
          </span>
        </div>

        {/* Specs */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {!isLand && beds && (
            <Spec icon={BedDouble} label={`${beds} Beds`} soft={accentSoft} />
          )}
          {!isLand && baths && (
            <Spec icon={Bath} label={`${baths} Baths`} soft={accentSoft} />
          )}
          {area && <Spec icon={Maximize2} label={isLand ? `${area} Aana` : `${area} sqft`} soft={accentSoft} />}
        </div>

        {/* Divider */}
        <div className="my-3.5 h-px bg-[#E0D4C5]/70" />

        {/* Price + posted */}
        <div className="mb-3.5 flex items-center justify-between">
          <p className="text-base font-extrabold leading-none" style={{ color: accent }}>
            {formatPrice(property.price, property.listingType)}
          </p>
          <p className="flex items-center gap-1 text-[10px] font-medium text-[#5C4D3C]/55">
            <CalendarDays className="h-3 w-3" /> Listed {posted}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/properties/${property._id}?from=my-listings`}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-[#FBF7EF] px-3 py-2 text-xs font-bold text-[#342417] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#342417]/25 hover:bg-white hover:shadow-md active:scale-95"
          >
            <Eye className="h-3.5 w-3.5" /> View
          </Link>
          <button
            type="button"
            onClick={onEdit}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-[#FBF7EF] px-3 py-2 text-xs font-bold text-[#342417] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#342417]/25 hover:bg-white hover:shadow-md active:scale-95 cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:bg-red-100 hover:shadow-md active:scale-95 cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function Spec({
  icon: Icon,
  label,
  soft,
}: {
  icon: typeof BedDouble;
  label: string;
  soft: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-bold text-[#342417]"
      style={{ backgroundColor: soft }}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}
