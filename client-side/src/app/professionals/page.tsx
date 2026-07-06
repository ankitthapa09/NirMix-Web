import type { Metadata } from "next";
import { ProfessionalsDirectory } from "@/features/professionals/ProfessionalsDirectory";

export const metadata: Metadata = {
  title: "Find Professionals",
  description: "Browse verified engineers, architects, agents, interior designers and contractors across Nepal.",
  alternates: { canonical: "/professionals" },
};

export default function ProfessionalsPage() {
  return <ProfessionalsDirectory />;
}
