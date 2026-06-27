"use client";

import { Home, Building, Map, Bed } from "lucide-react";

interface StepBasicsProps {
  formData: any;
  onChange: (data: any) => void;
  errors: Record<string, string>;
}

const PROPERTY_TYPES = [
  {
    id: "House",
    label: "House",
    sub: "Detached / Duplex",
    icon: Home,
  },
  {
    id: "Apartment",
    label: "Apartment",
    sub: "Flat / Studio",
    icon: Building,
  },
  {
    id: "Land",
    label: "Land",
    sub: "Plot / Farmland",
    icon: Map,
  },
  {
    id: "Room",
    label: "Room",
    sub: "Single room / PG",
    icon: Bed,
  },
];

export function StepBasics({ formData, onChange, errors }: StepBasicsProps) {
  const { listingType, propertyType, title, description } = formData;

  const handleUpdate = (fields: any) => {
    onChange({ ...formData, ...fields });
  };

  return (
    <div className="space-y-4">
      {/* Listing Type Toggle */}
      <div>
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/70 mb-2">
          LISTING TYPE
        </label>
        <div className="flex p-1 bg-white rounded-xl border border-[#E0D4C5] w-full sm:w-72">
          <button
            type="button"
            onClick={() => handleUpdate({ listingType: "For Sale" })}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              listingType === "For Sale"
                ? "bg-[#E5C158] text-[#342417] shadow-sm font-extrabold"
                : "text-[#342417]/60 hover:text-[#342417]"
            }`}
          >
            For Sale
          </button>
          <button
            type="button"
            onClick={() => handleUpdate({ listingType: "For Rent" })}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all cursor-pointer ${
              listingType === "For Rent"
                ? "bg-[#E5C158] text-[#342417] shadow-sm font-extrabold"
                : "text-[#342417]/60 hover:text-[#342417]"
            }`}
          >
            For Rent
          </button>
        </div>
        {errors.listingType && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.listingType}</p>
        )}
      </div>

      {/* Property Type Selection Cards */}
      <div>
        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/70 mb-2">
          PROPERTY TYPE
        </label>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {PROPERTY_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = propertyType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handleUpdate({ propertyType: type.id })}
                className={`flex flex-col items-start justify-between p-4 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer h-24 ${
                  isSelected
                    ? "border-[#E5C158] bg-[#E5C158] text-[#342417] shadow-[0_0_15px_rgba(229,193,88,0.25)]"
                    : "border-[#E0D4C5]/80 bg-white hover:bg-[#FAF6F0]"
                }`}
              >
                <Icon className={`h-5 w-5 ${isSelected ? "text-[#342417]" : "text-[#5C4D3C]/60"}`} />
                <div>
                  <span className={`block text-xs font-bold ${isSelected ? "text-[#342417]" : "text-[#342417]"}`}>
                    {type.label}
                  </span>
                  <span className={`block text-[10px] ${isSelected ? "text-[#342417]/70" : "text-[#342417]/50"} mt-0.5`}>
                    {type.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.propertyType && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.propertyType}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="property-title" className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/70 mb-2">
          TITLE
        </label>
        <input
          id="property-title"
          type="text"
          value={title || ""}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="e.g. Modern 4BHK Duplex in Bhaisepati"
          className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E5C158] text-xs text-[#342417] placeholder-[#342417]/40 transition-all font-medium"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="property-description" className="block text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/70 mb-2">
          DESCRIPTION
        </label>
        <textarea
          id="property-description"
          value={description || ""}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Describe the property — layout, neighbourhood, what makes it special."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E0D4C5] bg-white focus:outline-none focus:border-[#E5C158] text-xs text-[#342417] placeholder-[#342417]/40 transition-all font-medium resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-red-500 font-medium">{errors.description}</p>
        )}
      </div>
    </div>
  );
}
