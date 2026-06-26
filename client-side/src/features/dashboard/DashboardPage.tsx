"use client";

import { WelcomeHeader } from "./components/WelcomeHeader";
import { PropertyFeed } from "./components/PropertyFeed";
import { SidebarWidgets } from "./components/SidebarWidgets";

export function DashboardPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <WelcomeHeader />

      {/* Main content area: feed + sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <PropertyFeed />
        <SidebarWidgets />
      </div>
    </div>
  );
}
