import type { Metadata } from "next";
import { SavedPropertiesPage } from "@/features/dashboard/SavedPropertiesPage";

export const metadata: Metadata = {
  title: "Saved Properties",
  description: "The properties you’ve shortlisted on NirMix.",
};

export default function SavedRoute() {
  return <SavedPropertiesPage />;
}
