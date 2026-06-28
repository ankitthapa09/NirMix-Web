import type { Metadata } from "next";
import { PropertyListingPage } from "@/features/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Rent Property",
  description: "Find move-in-ready apartments, houses and rooms for rent across Nepal.",
  // Filter/category query variations (?type=…) consolidate to this clean path.
  alternates: { canonical: "/rent" },
};

export default async function RentPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <PropertyListingPage mode="rent" initialType={type} />;
}
