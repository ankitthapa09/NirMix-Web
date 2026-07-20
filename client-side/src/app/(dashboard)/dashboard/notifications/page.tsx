import type { Metadata } from "next";
import { NotificationsPage } from "@/features/dashboard/NotificationsPage";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Visit requests, status updates and new reviews on your NirMix listings.",
};

export default function NotificationsRoute() {
  return <NotificationsPage />;
}
