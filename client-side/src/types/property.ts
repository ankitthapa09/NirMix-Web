export type PropertyType = "House" | "Land" | "Apartment";

export type ListerType = "Personal" | "Agent" | "Builder";

export type Lister = {
  type: ListerType;
  name: string;
  company?: string;
  phone?: string;
  email?: string;
  verified?: boolean;
  listings?: number;
};

export type Property = {
  id: string;
  title: string;
  type: PropertyType;
  price: number;
  location: {
    district: string;
    city: string;
    neighborhood: string;
  };
  beds: number;
  baths: number;
  areaSqft: number;
  areaUnit?: "sqft" | "Aana";
  photos: string[];
  status: "For Sale" | "For Rent";
  featured?: boolean;
  tag?: "NEW" | "VERIFIED" | "HOT";
  description: string;
  agent: {
    name: string;
    company: string;
  };
  // ── Detailed listing info (shown on the property detail page) ──
  /** Owner's user id — used to show owner-only controls (e.g. visit requests). */
  ownerId?: string;
  /** Who posted it — personal owner, agent, or builder. */
  listedBy?: Lister;
  postedOn?: string;
  /** Spec rows entered while listing (label/value pairs). */
  specs?: { label: string; value: string }[];
  amenities?: string[];
  highlights?: string[];
  /** YouTube / Vimeo video tour link. */
  videoLink?: string;
  /** Uploaded floor plan (image or PDF). */
  floorPlan?: { url: string; name?: string };
  /** Map pin for the interactive map / "open in Google Maps". */
  coordinates?: { lat: number; lng: number };
  /** Optional finer-grained address bits. */
  wardNo?: string;
  landmark?: string;
};
