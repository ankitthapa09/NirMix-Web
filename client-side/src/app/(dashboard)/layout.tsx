"use client";

import { useState, type ReactNode } from "react";
import { DashboardNavbar } from "@/features/dashboard/components/DashboardNavbar";
import { DashboardMenu } from "@/features/dashboard/components/DashboardMenu";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5EFE6]">
      <DashboardNavbar onMenuOpen={() => setMenuOpen(true)} />
      <DashboardMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>{children}</main>
    </div>
  );
}
