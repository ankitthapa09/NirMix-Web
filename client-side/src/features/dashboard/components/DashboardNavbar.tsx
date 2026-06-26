"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DashboardNavbarProps {
  onMenuOpen: () => void;
}

const navItems = [
  { label: "Overview", href: "/dashboard" },
  { label: "My Listing", href: "/dashboard/my-listings" },
  { label: "Saved Properties", href: "/dashboard/saved" },
];

export function DashboardNavbar({ onMenuOpen }: DashboardNavbarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <header className="sticky top-0 z-50 bg-[#4A5544] shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link href="/dashboard" className="flex items-center">
            <Image
              src="/images/NirMix_Logo.png"
              alt="NirMix Logo"
              width={120}
              height={40}
              className="h-10 w-auto object-contain brightness-110"
              priority
            />
          </Link>
        </div>

        {/* Center: Nav Links (desktop) */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Home pill + Bell + Avatar */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="hidden sm:inline-flex rounded-full bg-[#342417] px-5 py-2 text-xs font-bold text-white shadow transition hover:bg-[#251910]"
          >
            Home
          </Link>

          <button
            type="button"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-[#342417] text-xs font-bold text-white">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
