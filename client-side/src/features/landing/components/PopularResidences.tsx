import Image from "next/image";
import Link from "next/link";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { getFeaturedProperties } from "@/lib/mock-data";

export function PopularResidences() {
  const featured = getFeaturedProperties();

  const formatPrice = (price: number, status: string) => {
    if (status === "For Rent") {
      return `NPR ${price.toLocaleString("en-NP")}/mo`;
    }
    if (price >= 10000000) {
      return `NPR ${(price / 10000000).toFixed(1)} Cr`;
    }
    if (price >= 100000) {
      return `NPR ${(price / 100000).toFixed(1)} Lakh`;
    }
    return `NPR ${price.toLocaleString("en-NP")}`;
  };

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-ink sm:text-4xl">
            Our Popular Residences
          </h2>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((property) => (
            <Link
              key={property.id}
              href={`/properties/${property.id}`}
              className="group overflow-hidden rounded-2xl border border-mist/60 bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={property.photos[0]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Status Badge */}
                <span
                  className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ${
                    property.status === "For Sale" ? "bg-jade" : "bg-ember"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-4">
                {/* Location */}
                <div className="mb-2 flex items-center gap-1.5 text-xs text-slate">
                  <MapPin className="h-3.5 w-3.5 text-ember" />
                  <span>
                    {property.location.neighborhood},{" "}
                    {property.location.city}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-ink line-clamp-1">
                  {property.title}
                </h3>

                {/* Specs Row */}
                <div className="mt-3 flex items-center gap-4 border-t border-mist/40 pt-3 text-[11px] text-slate">
                  <span className="flex items-center gap-1">
                    <BedDouble className="h-3.5 w-3.5" />
                    {property.beds} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="h-3.5 w-3.5" />
                    {property.baths} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize className="h-3.5 w-3.5" />
                    {property.areaSqft.toLocaleString()} sq ft
                  </span>
                </div>

                {/* Price */}
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-lg font-extrabold text-ember">
                    {formatPrice(property.price, property.status)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
