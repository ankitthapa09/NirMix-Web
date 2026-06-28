import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyById } from "@/lib/mock-data";
import { PropertyDetailPage } from "@/features/properties/PropertyDetailPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) return { title: "Property not found" };
  return {
    title: property.title,
    description: property.description,
    alternates: { canonical: `/properties/${id}` },
  };
}

export default async function PropertyDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);
  if (!property) notFound();
  return <PropertyDetailPage property={property} />;
}
