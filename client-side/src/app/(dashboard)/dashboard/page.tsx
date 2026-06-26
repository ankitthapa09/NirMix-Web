import { DashboardPage } from "@/features/dashboard/DashboardPage";

export const metadata = {
  title: "Dashboard",
  description: "Your NirMix dashboard — manage listings, track activity, and grow your portfolio.",
};

export default function DashboardRoute() {
  return <DashboardPage />;
}
