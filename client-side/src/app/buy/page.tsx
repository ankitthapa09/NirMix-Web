import type { Metadata } from "next";
import { PropertyListingPage } from "@/features/properties/PropertyListingPage";

export const metadata: Metadata = {
  title: "Buy Property",
  description: "Browse verified homes, apartments and land for sale across Nepal.",
  // Filter/category query variations (?type=…) consolidate to this clean path.
  alternates: { canonical: "/buy" },
};

export default async function BuyPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  return <PropertyListingPage mode="buy" initialType={type} />;
}
