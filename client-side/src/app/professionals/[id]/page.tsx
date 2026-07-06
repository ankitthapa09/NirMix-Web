import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchPublicPortfolioById } from "@/lib/portfolio-api";
import { ProfessionalProfile } from "@/features/professionals/ProfessionalProfile";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const pro = await fetchPublicPortfolioById(id);
  if (!pro) return { title: "Professional not found" };
  return {
    title: `${pro.owner.name} — ${pro.categoryLabel}`,
    description: pro.headline || pro.bio.slice(0, 150) || undefined,
    alternates: { canonical: `/professionals/${id}` },
  };
}

export default async function ProfessionalProfileRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pro = await fetchPublicPortfolioById(id);
  if (!pro) notFound();
  return <ProfessionalProfile pro={pro} />;
}
