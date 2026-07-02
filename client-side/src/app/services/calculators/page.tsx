import type { Metadata } from "next";
import { CalculatorsPage } from "@/features/services/CalculatorsPage";

export const metadata: Metadata = {
  title: "Calculators — NirMix Tools",
  description: "Free construction & finance calculators for Nepal: material estimator, cost, concrete mix, beam load, EMI, area converter and more.",
  alternates: { canonical: "/services/calculators" },
};

export default function CalculatorsRoute() {
  return <CalculatorsPage />;
}
