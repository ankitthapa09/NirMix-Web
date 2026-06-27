import { Suspense } from "react";
import { DashboardPage } from "@/features/dashboard/DashboardPage";

export const metadata = {
  title: "Dashboard",
  description: "Your NirMix dashboard — manage listings, track activity, and grow your portfolio.",
};

export default function DashboardRoute() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#F5EFE6]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#342417] border-t-transparent" />
      </div>
    }>
      <DashboardPage />
    </Suspense>
  );
}
