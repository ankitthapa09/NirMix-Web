import type { Metadata } from "next";
import { ValuationPage } from "@/features/services/ValuationPage";

export const metadata: Metadata = {
  title: "Property Valuation — NirMix",
  description: "Get an indicative market value estimate for your property based on location, type, size and condition.",
  alternates: { canonical: "/services/valuation" },
};

export default function ValuationRoute() {
  return <ValuationPage />;
}
