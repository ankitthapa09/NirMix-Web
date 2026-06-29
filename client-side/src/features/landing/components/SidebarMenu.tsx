"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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

interface DashboardSidebarProps {
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

export function SidebarMenu({ isOpen, onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

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
      {/* Sidebar Drawer Backdrop (overlaying navbar at z-50) */}
      <div
        className={`fixed inset-0 z-[60] bg-black/45 backdrop-blur-md transition-opacity duration-300 ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed inset-y-0 right-0 z-[70] w-72 bg-gradient-to-b from-[#4F5B48] via-[#434F3D] to-[#2E372A] shadow-2xl transition-transform duration-300 ease-in-out overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="relative flex h-full min-h-screen flex-col justify-between bg-gradient-to-b from-[#4F5B48]/98 via-[#434F3D]/98 to-[#2E372A]/98 text-white p-5 sm:p-6 border-l border-[#D4C3A3]/25 select-none">
          {/* Background Patterns (z-0) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '32px 32px'
              }}
            />
            <div
              className="absolute inset-0 opacity-[0.05]"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1.2px, transparent 1.2px)',
                backgroundSize: '16px 16px'
              }}
            />
            <div className="absolute -top-[10%] -right-[10%] w-[60%] h-[40%] rounded-full bg-[#C4A96A] opacity-[0.08] blur-[80px]" />
            <div className="absolute -bottom-[10%] -left-[10%] w-[60%] h-[40%] rounded-full bg-[#342417] opacity-[0.35] blur-[90px]" />
          </div>

          <div className="relative z-10">
            {/* Header (Logo & Close Button) */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4C3A3]/15 mb-4">
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
                onClick={onClose}
                className="rounded-full p-1.5 bg-white/5 border border-[#D4C3A3]/25 text-white hover:bg-white/10 hover:text-[#D4C3A3] transition-all cursor-pointer"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* User Profile Card (Moved to the top, above Activity) */}
            <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-white/10 border border-[#D4C3A3]/25 shadow-lg mb-5 bg-gradient-to-r from-white/[0.08] to-transparent">
              <div className="relative h-11 w-11 shrink-0 rounded-full border border-[#D4C3A3]/40 bg-[#342417] overflow-hidden flex items-center justify-center text-white text-xs font-bold shadow-inner">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initials
                )}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#4F5B48]" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-[#D4C3A3] leading-none uppercase tracking-widest mb-1 opacity-80">Account Profile</p>
                <p className="text-sm font-extrabold text-white leading-tight truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-white/50 truncate">
                  {user?.email || "user@example.com"}
                </p>
              </div>
            </div>

            {/* Navigation Section: Activity */}
            <div className="mb-4">
              <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-[#D4C3A3] mb-2">
                Activity
              </h3>
              <nav className="flex flex-col gap-0.5">
                {activityLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all border-l-4 ${isActive
                        ? "bg-white/10 text-white border-[#D4C3A3]"
                        : "text-white/80 hover:bg-white/5 hover:text-white border-transparent"
                        }`}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-[#D4C3A3]" : "text-white/60 group-hover:text-[#D4C3A3]"
                        }`} />
                      <span>{item.label}</span>
                      {item.badge && item.badge !== "dot" && (
                        <span className="ml-auto flex h-5 w-7 items-center justify-center rounded-full bg-[#342417] text-[10px] font-bold text-white shadow-inner">
                          {item.badge}
                        </span>
                      )}
                      {item.badge === "dot" && (
                        <span className="ml-auto h-2 w-2 rounded-full bg-red-500 shadow-md shadow-red-500/50" />
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Navigation Section: Account */}
            <div>
              <h3 className="px-3 text-[11px] font-extrabold uppercase tracking-widest text-[#D4C3A3] mb-2">
                Account
              </h3>
              <nav className="flex flex-col gap-0.5">
                {accountLinks.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all border-l-4 ${isActive
                        ? "bg-white/10 text-white border-[#D4C3A3]"
                        : "text-white/80 hover:bg-white/5 hover:text-white border-transparent"
                        }`}
                    >
                      <item.icon className={`h-5 w-5 shrink-0 transition-colors ${isActive ? "text-[#D4C3A3]" : "text-white/60 group-hover:text-[#D4C3A3]"
                        }`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Footer: Logout */}
          <div className="relative z-10 pt-3 border-t border-[#D4C3A3]/15 mt-4">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-500/10 hover:bg-red-600/20 hover:text-red-200 border border-red-500/30 py-2.5 text-xs font-bold uppercase tracking-wider text-red-300 transition-all cursor-pointer"
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
