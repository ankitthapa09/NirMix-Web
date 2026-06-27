"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { WelcomeHeader } from "./components/WelcomeHeader";
import { PropertyFeed } from "./components/PropertyFeed";
import { SidebarWidgets } from "./components/SidebarWidgets";
import { PropertyCreateWizard } from "./components/PropertyCreateWizard";

export function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get("create") === "true") {
      setIsWizardOpen(true);
    }
  }, [searchParams]);

  const handleOpenWizard = () => {
    setIsWizardOpen(true);
    // Push state to URL so refreshing keeps the wizard open, but doesn't cause a hard reload
    const params = new URLSearchParams(window.location.search);
    params.set("create", "true");
    router.replace(`/dashboard?${params.toString()}`);
  };

  const handleCloseWizard = () => {
    setIsWizardOpen(false);
    // Remove query param from URL
    const params = new URLSearchParams(window.location.search);
    params.delete("create");
    router.replace(`/dashboard${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      <WelcomeHeader onStartListing={handleOpenWizard} />

      {/* Main content area: feed + sidebar */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <PropertyFeed />
        <SidebarWidgets />
      </div>

      <PropertyCreateWizard isOpen={isWizardOpen} onClose={handleCloseWizard} />
    </div>
  );
}
