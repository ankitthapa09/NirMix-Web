import Image from "next/image";
import Link from "next/link";
import { MapPin, ChevronLeft, ChevronRight, Home, Maximize } from "lucide-react";

const properties = [
  {
    id: 1,
    image: "/images/property-1.png",
    location: "San Francisco, California",
    rooms: 4,
    area: "3,500 sq ft",
    price: "$2,500,000",
  },
  {
    id: 2,
    image: "/images/property-2.png",
    location: "Beverly Hills, California",
    rooms: 3,
    area: "1,500 sq ft",
    price: "$850,000",
  },
  {
    id: 3,
    image: "/images/property-3.png",
    location: "Palo Alto, California",
    rooms: 6,
    area: "4,000 sq ft",
    price: "$3,700,000",
  },
];

export function PopularResidences() {
  return (
    <section className="bg-[#FAF7F0] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold text-[#342417] sm:text-5xl">
            Our Popular Residences
          </h2>
        </div>

        {/* Property Grid (3 columns) */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="group overflow-hidden rounded-3xl bg-[#EAE0D5]/40 border border-[#342417]/5 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden m-3 rounded-2xl">
                <Image
                  src={property.image}
                  alt={property.location}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Card Body */}
              <div className="px-6 pb-6 pt-2">
                {/* Location */}
                <div className="mb-3 flex items-center gap-1.5 text-sm font-bold text-[#342417]">
                  <MapPin className="h-4 w-4 text-[#342417]" />
                  <span>{property.location}</span>
                </div>

                {/* Specs Row */}
                <div className="flex items-center gap-4 text-xs font-semibold text-[#5C4D3C] pb-4 border-b border-[#342417]/10">
                  <span className="flex items-center gap-1.5">
                    <Home className="h-4 w-4 text-[#5C4D3C]/65" />
                    {property.rooms} Rooms
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Maximize className="h-4 w-4 text-[#5C4D3C]/65" />
                    {property.area}
                  </span>
                </div>

                {/* Price & Sign up Button Row */}
                <div className="mt-4 flex items-center justify-between">
                  <Link
                    href="/signup"
                    className="rounded-md bg-[#342417] px-4 py-1.5 text-[10px] font-bold text-white transition-all hover:bg-[#251910] cursor-pointer"
                  >
                    Sign up
                  </Link>
                  <span className="text-base font-extrabold text-[#342417]">
                    {property.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Indicators / Slider Arrows below */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#342417] text-white hover:bg-[#251910] transition-colors cursor-pointer shadow-xs"
            aria-label="Previous properties"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#342417] text-white hover:bg-[#251910] transition-colors cursor-pointer shadow-xs"
            aria-label="Next properties"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
