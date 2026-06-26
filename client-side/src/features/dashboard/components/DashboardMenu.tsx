"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import {
  X,
  LayoutGrid,
  Home,
  Heart,
  Gavel,
  Mail,
  Wallet,
  User,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface DashboardMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const activityLinks = [
  { icon: LayoutGrid, label: "Overview", href: "/dashboard", badge: null },
  {
    icon: Home,
    label: "My Listings",
    href: "/dashboard/my-listings",
    badge: null,
  },
  {
    icon: Heart,
    label: "Saved Properties",
    href: "/dashboard/saved",
    badge: "12",
  },
  { icon: Gavel, label: "My Bids", href: "/dashboard/bids", badge: null },
  {
    icon: Mail,
    label: "Messages",
    href: "/dashboard/messages",
    badge: "dot",
  },
  {
    icon: Wallet,
    label: "Payments",
    href: "/dashboard/payments",
    badge: null,
  },
];

const accountLinks = [
  { icon: User, label: "Profile", href: "/dashboard/profile" },
  { icon: Bell, label: "Notifications", href: "/dashboard/notifications" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function DashboardMenu({ isOpen, onClose }: DashboardMenuProps) {
  const { user, logout } = useAuth();

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleLogout = async () => {
    onClose();
    await logout();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Menu Panel */}
      <div
        className={`fixed inset-x-4 top-4 bottom-4 z-[70] mx-auto max-w-4xl rounded-3xl bg-[#4A5544] shadow-2xl transition-all duration-400 overflow-hidden ${
          isOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Dashboard Menu"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:bg-white/10 hover:text-white cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Two-column content */}
        <div className="relative flex h-full flex-col justify-between p-8 pt-14 sm:flex-row sm:p-12 sm:pt-16">
          {/* Left Column — ACTIVITY */}
          <div className="flex-1">
            <h2
              className="mb-8 text-xl font-extrabold uppercase tracking-[0.15em] text-[#C4A96A]"
              style={{ fontFamily: "serif" }}
            >
              Activity
            </h2>

            <nav className="flex flex-col gap-1">
              {activityLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3.5 rounded-xl px-3 py-3 text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  <item.icon className="h-5 w-5 shrink-0 text-white/60 group-hover:text-white" />
                  <span className="text-base font-semibold">{item.label}</span>

                  {/* Count badge */}
                  {item.badge && item.badge !== "dot" && (
                    <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#5A7A50] px-1.5 text-[10px] font-bold text-white">
                      {item.badge}
                    </span>
                  )}

                  {/* Red dot badge */}
                  {item.badge === "dot" && (
                    <span className="ml-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Column — ACCOUNT */}
          <div className="mt-10 flex-1 sm:mt-0 sm:pl-12">
            <h2
              className="mb-8 text-xl font-extrabold uppercase tracking-[0.15em] text-[#C4A96A]"
              style={{ fontFamily: "serif" }}
            >
              Account
            </h2>

            {/* User Info */}
            <div className="mb-8 flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/30 bg-[#342417] text-sm font-bold text-white">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/60">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* Account Nav */}
            <nav className="flex flex-col gap-1">
              {accountLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3.5 rounded-xl px-3 py-3 text-white/90 transition hover:bg-white/10 hover:text-white"
                >
                  <item.icon className="h-5 w-5 shrink-0 text-white/60 group-hover:text-white" />
                  <span className="text-base font-semibold">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Bottom: Logout Button */}
          <div className="absolute bottom-8 right-8 sm:bottom-10 sm:right-12">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-[#6B2020] px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition hover:bg-[#8B2020] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* Bottom-left: Decorative building illustration */}
          <div className="pointer-events-none absolute -bottom-2 -left-2 hidden h-44 w-52 opacity-30 sm:block">
            <Image
              src="/images/about-house.png"
              alt=""
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
}
