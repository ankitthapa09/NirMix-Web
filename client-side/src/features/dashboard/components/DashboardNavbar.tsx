"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { NotificationBell } from "./NotificationBell";

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
    <header className="sticky top-0 z-50 bg-[#A5A575]/85 backdrop-blur-md border-b-2 border-[#FFC71E] shadow-lg">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-2">
        {/* Left: Logo */}
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/images/NirMix_Logo.png"
            alt="NirMix Logo"
            width={140}
            height={46}
            className="h-14 w-auto object-contain brightness-110"
            priority
          />
        </Link>

        {/* Center: Nav Links (desktop) */}
        <nav className="hidden items-center gap-9 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-4 py-2 text-[16px] font-semibold transition-colors ${isActive
                  ? "text-[#402212] underline underline-offset-4 decoration-2"
                  : "text-[#2B1B12]/60 hover:text-[#803812]"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Home pill + Bell + Avatar + Menu Toggle */}
        <div className="flex items-center gap-9">
          <Link
            href="/"
            className="hidden sm:inline-flex rounded-full bg-[#342417] px-6 py-2.5 text-sm font-bold text-white shadow transition hover:bg-[#251910]"
          >
            Home
          </Link>

          <NotificationBell />

          {/* Avatar */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#FFC71E]/80 bg-[#342417] text-sm font-bold text-white">
            {user?.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name}
                width={44}
                height={44}
                className="h-full w-full object-cover"
              />
            ) : (
              initials
            )}
          </div>

          {/* Menu Toggle — large circular button (green border, fills on hover) */}
          <button
            type="button"
            onClick={onMenuOpen}
            className="group flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#27AE60] bg-[#35D140]/25 text-black transition-all duration-200 hover:bg-[#67912C] hover:scale-105 cursor-pointer"
            aria-label="Open menu"
          >
            <div className="flex flex-col gap-1 w-5 items-start">
              <span className="h-0.75 bg-black rounded-full transition-all duration-300 w-2.5 group-hover:w-5" />
              <span className="h-0.75 bg-black rounded-full transition-all duration-300 w-3.5 group-hover:w-5" />
              <span className="h-0.75 bg-black rounded-full transition-all duration-300 w-5" />
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
