import type { Metadata } from "next";
import { PropertyListingPage } from "@/features/properties/PropertyListingPage";
import type { ListingStatusFilter } from "@/features/properties/types";

export const metadata: Metadata = {
  title: "All Properties",
  description:
    "Browse every verified home, apartment, plot and rental across Nepal with powerful filters.",
  // Status/category/filter query variations consolidate to this clean hub path.
  alternates: { canonical: "/properties" },
};

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string }>;
}) {
  const { type, status } = await searchParams;
  const initialStatus: ListingStatusFilter | undefined =
    status === "sale" || status === "rent" ? status : undefined;

  return (
    <PropertyListingPage mode="all" initialType={type} initialStatus={initialStatus} />
  );
}
