import type { Metadata } from "next";
import { ProfessionalsDirectory } from "@/features/professionals/ProfessionalsDirectory";

export const metadata: Metadata = {
  title: "Property Dealers",
  description: "Find trusted property and land dealers across Nepal.",
  alternates: { canonical: "/dealers" },
};

// "Dealers" maps to the property-agent category (dealer/broker/dalal are used
// interchangeably in Nepal). Split into its own category later if needed.
export default function DealersPage() {
  return (
    <ProfessionalsDirectory
      initialCategory="agent"
      eyebrow="NirMix • Dealers"
      title="Property & land dealers"
      subtitle="Trusted dealers and brokers for land and property transactions across Nepal."
    />
  );
}
