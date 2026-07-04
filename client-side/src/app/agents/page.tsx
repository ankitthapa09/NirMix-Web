import type { Metadata } from "next";
import { ProfessionalsDirectory } from "@/features/professionals/ProfessionalsDirectory";

export const metadata: Metadata = {
  title: "Property Agents",
  description: "Connect with verified property agents and brokers across Nepal.",
  alternates: { canonical: "/agents" },
};

export default function AgentsPage() {
  return (
    <ProfessionalsDirectory
      initialCategory="agent"
      eyebrow="NirMix • Agents"
      title="Property agents & brokers"
      subtitle="Verified agents to help you buy, sell, rent or handle land paperwork across Nepal."
    />
  );
}
