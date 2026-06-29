import type { Metadata } from "next";
import { MyListingsPage } from "@/features/dashboard/MyListingsPage";

export const metadata: Metadata = {
  title: "My Listings",
  description: "Manage the properties you have listed on NirMix.",
};

export default function MyListingsRoute() {
  return <MyListingsPage />;
}
