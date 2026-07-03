import type { Metadata } from "next";
import { PortfolioCreateWizard } from "@/features/portfolio/PortfolioCreateWizard";

export const metadata: Metadata = {
  title: "Create Portfolio",
  description: "Build your professional NirMix portfolio — showcase your work and get discovered.",
};

export default async function CreatePortfolioRoute({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  return <PortfolioCreateWizard editId={edit} />;
}
