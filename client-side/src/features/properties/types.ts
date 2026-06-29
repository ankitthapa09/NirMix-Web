export type ListingMode = "buy" | "rent" | "all";

export type ListingStatusFilter = "all" | "sale" | "rent";

export interface ListingFilters {
  keyword: string;
  listingType: ListingStatusFilter;
  /** Single selected property category ("" = all categories). */
  category: string;
  minPrice: string;
  maxPrice: string;
  beds: string;
  baths: string;
  district: string;
  minArea: string;
  sort: "newest" | "price-asc" | "price-desc";
  /** Category/status-specific dynamic filter selections (chips, selects, toggles). */
  extra: Record<string, string[]>;
}

export const EMPTY_FILTERS: ListingFilters = {
  keyword: "",
  listingType: "all",
  category: "",
  minPrice: "",
  maxPrice: "",
  beds: "",
  baths: "",
  district: "",
  minArea: "",
  sort: "newest",
  extra: {},
};

// A selectable property category. `value` matches Property.type for filtering;
// `label` is what the user sees (e.g. "Apartment" → "Apartments").
export interface CategoryOption {
  value: string;
  label: string;
}

const CAT = {
  house: { value: "House", label: "House" },
  apartment: { value: "Apartment", label: "Apartments" },
  land: { value: "Land", label: "Land" },
  flats: { value: "Flats", label: "Flat / Studio" },
  room: { value: "Room", label: "Rooms" },
  office: { value: "Office Space", label: "Office Space" },
  shop: { value: "Shop Space", label: "Shop Space" },
} as const;

// Buy → 4 categories; Rent → 7; All hub → the full union.
export const CATEGORIES: Record<ListingMode, CategoryOption[]> = {
  buy: [CAT.house, CAT.apartment, CAT.land, CAT.flats],
  rent: [CAT.house, CAT.apartment, CAT.land, CAT.flats, CAT.room, CAT.office, CAT.shop],
  all: [CAT.house, CAT.apartment, CAT.land, CAT.flats, CAT.room, CAT.office, CAT.shop],
};

export const DISTRICT_OPTIONS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Kaski",
  "Chitwan",
];
