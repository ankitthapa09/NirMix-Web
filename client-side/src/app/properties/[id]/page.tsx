import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/mock-data";
import { fetchPropertyById } from "@/lib/property-api";
import { PropertyDetailPage } from "@/features/properties/PropertyDetailPage";
import type { Property } from "@/types/property";

// Resolve a listing from the API first, falling back to mock data so existing
// demo links keep working during the migration to real data.
async function resolveProperty(id: string): Promise<Property | undefined> {
  const api = await fetchPropertyById(id);
  if (api) return api;
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
