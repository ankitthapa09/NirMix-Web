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
      {/* Import the Google Fonts dynamically inside a self-contained style block */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Trade+Winds&family=Slackey&family=Titan+One&family=Lilita+One&family=Luckiest+Guy&family=Special+Elite&display=swap');
        .menu-heading-font {
          font-family: 'Trade Winds', 'Slackey', 'Luckiest Guy', 'Titan One', cursive;
        }
      ` }} />

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-md transition-opacity duration-300 ${isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centered Modal Container */}
      <div
        className={`fixed inset-0 z-[70] flex items-center justify-center p-4 transition-all duration-300 ${isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className={`relative w-full max-w-4xl h-[560px] rounded-[32px] bg-gradient-to-br from-[#4F5B48] via-[#434F3D] to-[#2E372A] shadow-2xl transition-all duration-500 ease-out overflow-hidden flex flex-col ${isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
          role="dialog"
          aria-modal="true"
          aria-label="Dashboard Menu"
        >
          {/* Background Patterns (z-0) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            {/* Top right design shape */}
            <div className="absolute top-0 right-0 w-[280px] h-[180px] bg-white/[0.04] rounded-bl-[160px]" />

            {/* Subtle Blueprint Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '48px 48px'
              }}
            />

            {/* Dotted Grid Pattern */}
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* Glowing Accent Blobs */}
            <div className="absolute top-[-10%] left-[-15%] w-[45%] h-[45%] rounded-full bg-[#C4A96A] opacity-[0.07] blur-[100px]" />
            <div className="absolute bottom-[-10%] right-[-15%] w-[50%] h-[50%] rounded-full bg-[#342417] opacity-30 blur-[120px]" />
            <div className="absolute top-[35%] left-[25%] w-[40%] h-[40%] rounded-full bg-[#8BA17A] opacity-[0.06] blur-[90px]" />
          </div>

          {/* Header Row */}
          <div className="relative z-20 flex items-center justify-between px-12 pt-8 pb-4 border-b border-[#D4C3A3]/15">
            <Link href="/dashboard" className="flex items-center" onClick={onClose}>
              <Image
                src="/images/NirMix_Logo.png"
                alt="NirMix Logo"
                width={140}
                height={46}
                className="h-11 w-auto object-contain brightness-110"
                priority
              />
            </Link>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-white hover:bg-white/10 hover:text-[#D4C3A3] transition-all cursor-pointer shadow-lg border border-[#D4C3A3]/25"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Two-Column Content Grid (z-20) */}
          <div className="relative z-20 grid grid-cols-2 flex-1 p-8 px-12 pt-6 pb-20">
            {/* Left Column: ACTIVITY */}
            <div className="flex flex-col h-full pr-8">
              <h2
                className="mb-5 text-2xl font-extrabold uppercase tracking-widest text-[#D4C3A3] menu-heading-font"
              >
                Activity
              </h2>
              <nav className="flex flex-col gap-1.5">
                {activityLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-4 rounded-xl px-4 py-2.5 text-white/90 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <item.icon className="h-6 w-6 shrink-0 text-white/60 group-hover:text-[#D4C3A3] transition-all group-hover:scale-105" />
                    <span className="text-lg font-semibold">{item.label}</span>
                    {item.badge && item.badge !== "dot" && (
                      <span className="ml-3 flex h-5 w-7 items-center justify-center rounded-full bg-[#342417] text-[10px] font-bold text-white shadow-inner">
                        {item.badge}
                      </span>
                    )}
                    {item.badge === "dot" && (
                      <span className="ml-3 h-2 w-2 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Column: ACCOUNT */}
            <div className="flex flex-col h-full pl-8 border-l border-[#D4C3A3]/25">
              <div>
                <h2
                  className="mb-3 text-2xl font-extrabold uppercase tracking-widest text-[#D4C3A3] menu-heading-font"
                >
                  Account
                </h2>

                {/* User Info (Shifted below the ACCOUNT heading) */}
                <div className="flex items-center gap-4 py-3.5 px-4 mb-4 rounded-2xl bg-white/10 border border-[#D4C3A3]/25 backdrop-blur-md shadow-lg bg-gradient-to-r from-white/[0.08] to-transparent">
                  <div className="relative h-14 w-14 shrink-0 rounded-full border-2 border-[#D4C3A3] bg-[#342417] overflow-hidden shadow-md">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                        {initials}
                      </div>
                    )}
                    {/* Online Dot */}
                    <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-[#2E372A]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-[#D4C3A3] leading-none uppercase tracking-widest mb-1.5 opacity-80">Account Profile</p>
                    <p className="text-lg font-bold text-white leading-tight truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-white/60 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </div>

                {/* Account Navigation */}
                <nav className="flex flex-col gap-1.5">
                  {accountLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-4 rounded-xl px-4 py-2.5 text-white/90 transition-all hover:bg-white/10 hover:text-white"
                    >
                      <item.icon className="h-6 w-6 shrink-0 text-white/60 group-hover:text-[#D4C3A3] transition-all group-hover:scale-105" />
                      <span className="text-lg font-semibold">{item.label}</span>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Bottom Right: Logout Button (z-30) */}
          <div className="absolute bottom-8 right-8 z-30">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-600/20 hover:text-red-200 border border-red-500/30 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-red-300 transition-all hover:scale-105 shadow-md cursor-pointer"
            >
              <LogOut className="h-4 w-4 text-red-400" />
              LOGOUT
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
