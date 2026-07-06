import type { Property, Lister, PropertyType } from "@/types/property";
import type { PropertyFormData, MediaItem } from "@/features/dashboard/components/create-steps/types";

export const API_BASE = "http://localhost:5001/api";

export interface ApiOwner {
  _id: string;
  name: string;
  avatar?: string;
  contact?: string;
  email?: string;
  isProfessional?: boolean;
  isEmailVerified?: boolean;
}

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
    coordinates?: { lat: number; lng: number };
  };
  price: number;
  videoLink?: string;
  details: Record<string, unknown>;
  photos: { url: string; publicId: string }[];
  floorPlan?: { url: string; publicId: string };
  createdAt: string;
  owner?: ApiOwner | string;
}

const numOf = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const strOf = (v: unknown): string | undefined =>
  v === undefined || v === null || String(v).trim() === "" ? undefined : String(v);

/** Map the backend property shape onto the frontend `Property` type used by the UI. */
export function mapApiToProperty(api: ApiProperty): Property {
  const d = api.details ?? {};
  const isLand = api.propertyType === "Land";
  const owner = typeof api.owner === "object" ? api.owner : undefined;

  const areaSqft = isLand
    ? numOf(d.landArea)
    : numOf(d.builtUpArea) || numOf(d.carpetArea) || numOf(d.roomSize) || numOf(d.landArea);

  const amenities = Array.isArray(d.amenities) ? (d.amenities as unknown[]).map(String) : [];

  const listedBy: Lister | undefined = owner
    ? {
        type: owner.isProfessional ? "Agent" : "Personal",
        name: owner.name,
        phone: owner.contact,
        email: owner.email,
        verified: owner.isEmailVerified,
      }
    : undefined;

  return {
    id: api._id,
    ownerId: owner?._id,
    title: api.title,
    type: api.propertyType as PropertyType,
    price: api.price,
    location: {
      district: api.location.district,
      city: api.location.city,
      neighborhood: api.location.area,
    },
    beds: numOf(d.beds),
    baths: numOf(d.baths),
    areaSqft,
    areaUnit: isLand ? "Aana" : "sqft",
    photos: api.photos?.map((p) => p.url) ?? [],
    status: api.listingType,
    description: api.description,
    agent: { name: owner?.name ?? "NirMix User", company: "" },
    listedBy,
    postedOn: api.createdAt,
    amenities,
    videoLink: strOf(api.videoLink),
    floorPlan: api.floorPlan ? { url: api.floorPlan.url } : undefined,
    coordinates: api.location.coordinates,
    wardNo: strOf(api.location.wardNo),
    landmark: strOf(api.location.landmark),
  };
}

/** Fetch all active listings, mapped to the UI `Property` type. */
export async function fetchProperties(): Promise<Property[]> {
  const res = await fetch(`${API_BASE}/properties`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch properties");
  const json = await res.json();
  const list = (json.data as ApiProperty[]) ?? [];
  return list.map(mapApiToProperty);
}

/** Fetch a single listing by id, mapped to the UI `Property` type (null if not found). */
export async function fetchPropertyById(id: string): Promise<Property | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ? mapApiToProperty(json.data as ApiProperty) : null;
  } catch {
    return null;
  }
}

/** Save (bookmark) a property for the current user. */
export async function saveProperty(id: string): Promise<void> {
  const { apiFetch } = await import("./api-client");
  const res = await apiFetch(`${API_BASE}/users/me/saved/${id}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to save property");
}

/** Remove a property from the current user's saved list. */
export async function unsaveProperty(id: string): Promise<void> {
  const { apiFetch } = await import("./api-client");
  const res = await apiFetch(`${API_BASE}/users/me/saved/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to remove saved property");
}

/** Fetch the current user's saved properties, mapped to the UI `Property` type. */
export async function fetchSavedProperties(): Promise<Property[]> {
  const { apiFetch } = await import("./api-client");
  const res = await apiFetch(`${API_BASE}/users/me/saved`);
  if (!res.ok) throw new Error("Failed to fetch saved properties");
  const json = await res.json();
  return ((json.data as ApiProperty[]) ?? []).map(mapApiToProperty);
}

/** Fetch the raw (unmapped) listing — needed to prefill the edit wizard with its full `details`. */
export async function fetchApiProperty(id: string): Promise<ApiProperty | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as ApiProperty) ?? null;
  } catch {
    return null;
  }
}

/** Reverse of the create payload: turn a stored listing back into wizard form data. */
export function apiPropertyToFormData(api: ApiProperty): Partial<PropertyFormData> {
  const photos: MediaItem[] = (api.photos ?? []).map((p) => ({
    url: p.url,
    publicId: p.publicId,
    name: "Uploaded photo",
  }));
  const floorPlan: MediaItem | null = api.floorPlan
    ? { url: api.floorPlan.url, publicId: api.floorPlan.publicId, name: "Uploaded floor plan" }
    : null;

  return {
    // Spread the type-specific fields back into the flat form first.
    ...(api.details as Record<string, unknown>),
    listingType: api.listingType,
    propertyType: api.propertyType,
    title: api.title,
    description: api.description,
    province: api.location.province,
    district: api.location.district,
    city: api.location.city,
    wardNo: api.location.wardNo,
    area: api.location.area,
    landmark: api.location.landmark ?? "",
    price: String(api.price),
    videoLink: api.videoLink ?? "",
    photos,
    floorPlan,
    termsAccepted: true,
  };
}
