"use client";

import { Home, Building, Map, Bed, Building2, Briefcase, Store } from "lucide-react";
import { PropertyFormData, StepProps } from "./types";

type StepBasicsProps = StepProps;

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
  {
    id: "Flats",
    label: "Flats",
    sub: "Studio",
    icon: Building2,
  },
  {
    id: "Office Space",
    label: "Office Space",
    sub: "Business / private",
    icon: Briefcase,
  },
  {
    id: "Shop Space",
    label: "Shop Space",
    sub: "Shutter / Retail",
    icon: Store,
  },
];

const DETAIL_FIELDS_TO_RESET = {
  price: "",
  negotiable: true,
  ownership: "",
  deposit: "",
  beds: "",
  baths: "",
  balconies: "",
  floor: "",
  floors: "",
  parking: "",
  builtUpArea: "",
  carpetArea: "",
  landArea: "",
  ropani: "",
  aana: "",
  paisa: "",
  daam: "",
  facing: "",
  furnishing: "",
  leaseTerm: "",
  minLease: "",
  availableFrom: "",
  zoning: "",
  roadSize: "",
  frontage: "",
  roadType: "",
  pricePerUnit: "",
  floorLevel: "",
  sharedFacilities: [],
  amenities: [],
};

export function StepBasics({ formData, onChange, errors }: StepBasicsProps) {
  const { listingType, propertyType, title, description } = formData;

  const handleUpdate = (fields: Partial<PropertyFormData>) => {
    onChange({ ...formData, ...fields });
  };

  const handleListingTypeChange = (newListingType: string) => {
    if (listingType === newListingType) return;

    let newPropertyType = propertyType;
    if (newListingType === "For Sale") {
      const allowed = ["House", "Apartment", "Land", "Room"];
      if (!allowed.includes(propertyType)) {
        newPropertyType = "House";
      }
    }

    onChange({
      ...formData,
      ...DETAIL_FIELDS_TO_RESET,
      listingType: newListingType,
      propertyType: newPropertyType,
    });
  };

  const handlePropertyTypeChange = (newPropertyType: string) => {
    if (propertyType === newPropertyType) return;

    onChange({
      ...formData,
      ...DETAIL_FIELDS_TO_RESET,
      propertyType: newPropertyType,
    });
  };

  const visibleTypes = listingType === "For Sale" ? PROPERTY_TYPES.slice(0, 4) : PROPERTY_TYPES;

  return (
    <div className="space-y-5">
      {/* Listing Type Toggle — engraved track, raised active pill */}
      <div>
        <label className="nm-label">Listing type</label>
        <div className="nm-track inline-flex p-1 rounded-xl gap-1 w-full sm:w-72">
          <button
            type="button"
            onClick={() => handleListingTypeChange("For Sale")}
            style={listingType === "For Sale" ? { backgroundColor: "var(--nm-accent)" } : undefined}
            className={`flex-1 py-2 text-center text-xs rounded-lg transition-all cursor-pointer ${listingType === "For Sale"
              ? "text-[#342417] font-extrabold shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_2px_5px_rgba(90,66,38,0.25)]"
              : "text-[#342417]/55 font-bold hover:text-[#342417]"
              }`}
          >
            For Sale
          </button>
          <button
            type="button"
            onClick={() => handleListingTypeChange("For Rent")}
            style={listingType === "For Rent" ? { backgroundColor: "var(--nm-accent)" } : undefined}
            className={`flex-1 py-2 text-center text-xs rounded-lg transition-all cursor-pointer ${listingType === "For Rent"
              ? "text-white font-extrabold shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_5px_rgba(90,66,38,0.25)]"
              : "text-[#342417]/55 font-bold hover:text-[#342417]"
              }`}
          >
            For Rent
          </button>
        </div>
        {errors.listingType && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.listingType}</p>
        )}
      </div>

      {/* Property Type Selection Cards */}
      <div>
        <label className="nm-label">Property type</label>
        <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
          {visibleTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = propertyType === type.id;

            return (
              <button
                key={type.id}
                type="button"
                onClick={() => handlePropertyTypeChange(type.id)}
                className={`nm-tile flex flex-col items-start justify-between p-4 text-left cursor-pointer h-24 ${isSelected ? "is-selected" : ""}`}
              >
                <Icon
                  className="h-5 w-5"
                  style={{ color: isSelected ? "var(--nm-accent)" : "rgba(92,77,60,0.6)" }}
                />
                <div>
                  <span className="block text-xs font-bold text-[#342417]">
                    {type.label}
                  </span>
                  <span className={`block text-[10px] mt-0.5 ${isSelected ? "text-[#342417]/70" : "text-[#342417]/50"}`}>
                    {type.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.propertyType && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.propertyType}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="property-title" className="nm-label">Title</label>
        <input
          id="property-title"
          type="text"
          value={title || ""}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="e.g. Modern 4BHK Duplex in Bhaisepati"
          className="nm-input px-4 py-3 text-xs font-semibold"
        />
        {errors.title && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.title}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="property-description" className="nm-label">Description</label>
        <textarea
          id="property-description"
          value={description || ""}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Describe the property — layout, neighbourhood, what makes it special."
          rows={4}
          className="nm-input px-4 py-3 text-xs font-semibold resize-none"
        />
        {errors.description && (
          <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.description}</p>
        )}
      </div>
    </div>
  );
}
