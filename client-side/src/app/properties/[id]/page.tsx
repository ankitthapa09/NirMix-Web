import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/mock-data";
import { PropertyDetailPage } from "@/features/properties/PropertyDetailPage";
import type { Property, Lister, PropertyType } from "@/types/property";

const API_BASE = "http://localhost:5001/api";

interface ApiOwner {
  _id: string;
  name: string;
  avatar?: string;
  contact?: string;
  email?: string;
  isProfessional?: boolean;
  isEmailVerified?: boolean;
}

interface ApiPropertyDetail {
  _id: string;
  referenceId: string;
  listingType: "For Sale" | "For Rent";
  propertyType: string;
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
  owner: ApiOwner | string;
}

const numOf = (v: unknown): number => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const strOf = (v: unknown): string | undefined =>
  v === undefined || v === null || String(v).trim() === "" ? undefined : String(v);

async function fetchApiProperty(id: string): Promise<ApiPropertyDetail | null> {
  try {
    const res = await fetch(`${API_BASE}/properties/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return (json.data as ApiPropertyDetail) ?? null;
  } catch {
    return null;
  }
}

function mapApiToProperty(api: ApiPropertyDetail): Property {
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

// Resolve a listing from the API first, falling back to mock data so existing
// demo links keep working during the migration to real data.
async function resolveProperty(id: string): Promise<Property | undefined> {
  const api = await fetchApiProperty(id);
  if (api) return mapApiToProperty(api);
  return getPropertyById(id);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = await resolveProperty(id);
  if (!property) return { title: "Property not found" };
  return {
    title: property.title,
    description: property.description,
    alternates: { canonical: `/properties/${id}` },
  };
}

export default async function PropertyDetailRoute({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string }>;
}) {
  const { id } = await params;
  const { from } = await searchParams;
  const property = await resolveProperty(id);
  if (!property) notFound();

  const backTo =
    from === "my-listings"
      ? { href: "/dashboard/my-listings", label: "Back to My Listings" }
      : undefined;

  return <PropertyDetailPage property={property} backTo={backTo} />;
}
