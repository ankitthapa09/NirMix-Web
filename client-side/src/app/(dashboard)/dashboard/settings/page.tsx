import type { Metadata } from "next";
import { SettingsPage } from "@/features/dashboard/SettingsPage";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your NirMix account, security, notifications, listing preferences and privacy.",
};

export default function SettingsRoute() {
  return <SettingsPage />;
}
