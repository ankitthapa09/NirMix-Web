"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  LayoutGrid,
  User,
  LogOut,
  ChevronRight,
  Settings,
  Home,
  Building2,
  Building,
  Map,
  BedDouble,
  Briefcase,
  Store,
  ArrowRight,
  Calculator,
  TrendingUp,
} from "lucide-react";
import { siteConfig } from "@/config/site.config";
import { useAuth } from "@/lib/auth-context";
import { CATEGORIES, type ListingMode } from "@/features/properties/types";
import { SidebarMenu } from "./SidebarMenu";

const NAV_TYPE_ICONS: Record<string, typeof Home> = {
  House: Home,
  Apartment: Building2,
  Land: Map,
  Flats: Building,
  Room: BedDouble,
  "Office Space": Briefcase,
  "Shop Space": Store,
};

function NavDropdown({ label, mode }: { label: string; mode: ListingMode }) {
  const base = mode === "buy" ? "/buy" : "/rent";
  const accent = mode === "buy" ? "#B05B33" : "#157A74";

  return (
    <div className="group relative">
      {/* Top label is hover-only (not a link); only the dropdown items navigate. */}
      <span className="flex select-none items-center gap-0.5 cursor-default hover:text-ember transition-colors">
        {label}
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </span>

      {/* hover bridge + panel */}
      <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-mist bg-[#FBF7EF]/98 shadow-[0_20px_50px_rgba(52,36,23,0.22)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="border-b border-mist px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: accent }}>
              {label}
            </p>
            <p className="mt-0.5 text-[11px] font-medium normal-case text-slate/70">
              Browse {mode === "buy" ? "homes to own" : "rentals"} by category
            </p>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {CATEGORIES[mode].map((cat) => {
              const Icon = NAV_TYPE_ICONS[cat.value] ?? Home;
              return (
                <Link
                  key={cat.value}
                  href={`${base}?type=${encodeURIComponent(cat.value)}`}
                  className="group/i flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold normal-case text-[#342417] transition hover:bg-white"
                >
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${accent}14`, color: accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  {cat.label}
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate/30 transition group-hover/i:translate-x-0.5 group-hover/i:text-slate/60" />
                </Link>
              );
            })}
          </div>
          <Link
            href={base}
            className="flex items-center justify-between border-t border-mist px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider transition hover:bg-white"
            style={{ color: accent }}
          >
            View all {mode === "buy" ? "for sale" : "for rent"}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ServiceLink {
  label: string;
  desc: string;
  href: string;
  icon: typeof Calculator;
}

const SERVICE_LINKS: ServiceLink[] = [
  {
    label: "Calculators",
    desc: "Material, cost, concrete, EMI & more",
    href: "/services/calculators",
    icon: Calculator,
  },
  {
    label: "Property Valuation",
    desc: "Estimate your property's market value",
    href: "/services/valuation",
    icon: TrendingUp,
  },
];

function ServiceItem({ item, accent }: { item: ServiceLink; accent: string }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      className="group/i flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold normal-case text-[#342417] transition hover:bg-white"
    >
      <span
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: `${accent}14`, color: accent }}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span>{item.label}</span>
        <span className="truncate text-[11px] font-medium text-slate/55">{item.desc}</span>
      </span>
      <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-slate/30 transition group-hover/i:translate-x-0.5 group-hover/i:text-slate/60" />
    </Link>
  );
}

function ServicesDropdown() {
  const accent = "#B0892E";

  return (
    <div className="group relative">
      {/* Hover-only label; only the dropdown items navigate. */}
      <span className="flex select-none items-center gap-0.5 cursor-default hover:text-ember transition-colors">
        Services
        <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
      </span>

      <div className="invisible absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 translate-y-1 pt-4 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
        <div className="overflow-hidden rounded-2xl border border-mist bg-[#FBF7EF]/98 shadow-[0_20px_50px_rgba(52,36,23,0.22)] ring-1 ring-black/5 backdrop-blur-xl">
          <div className="border-b border-mist px-4 py-3">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em]" style={{ color: accent }}>
              Services
            </p>
            <p className="mt-0.5 text-[11px] font-medium normal-case text-slate/70">
              Tools to plan your property journey
            </p>
          </div>
          <div className="p-2">
            {SERVICE_LINKS.map((s) => (
              <ServiceItem key={s.href} item={s} accent={accent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-mist/60 bg-[#F9F4EA]/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/images/NirMix_Logo.png"
              alt="NirMix Logo"
              width={140}
              height={46}
              className="h-12 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-9 text-xs font-bold uppercase text-slate/80 md:flex">
            <Link href="/" className="hover:text-ember transition-colors">
              Home
            </Link>
            <NavDropdown label="Buy" mode="buy" />
            <NavDropdown label="Rent" mode="rent" />
            <Link
              href="/properties"
              className="border border-[#342417] rounded-md px-3.5 py-1.5 text-xs text-[#342417] hover:bg-[#342417] hover:text-white transition-all font-extrabold bg-[#342417]/5"
            >
              All Property
            </Link>
            <Link href="/agents" className="hover:text-ember transition-colors">
              Agents
            </Link>
            <ServicesDropdown />
          </nav>

          {/* Right Actions */}
          <div className="hidden items-center gap-9 md:flex">
            <button
              type="button"
              className="text-slate transition-colors hover:text-ember cursor-pointer"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 rounded-full pr-4 pl-1 py-1 transition-colors hover:bg-[#342417]/5 cursor-pointer text-left focus:outline-hidden"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#FFC71E] bg-[#342417] text-md font-bold text-white">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>
                  <span className="text-sm font-semibold text-[#342417]">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#342417]/60" />
                </button>

                {/* Small Dropdown Menu — Premium Dark Glassmorphic Design */}
                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-72 rounded-2xl bg-gradient-to-b from-[#4F5B48]/98 via-[#434F3D]/98 to-[#2E372A]/98 backdrop-blur-xl border border-[#D4C3A3]/25 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/5 py-4 px-3 z-50 animate-fade-in flex flex-col gap-1 text-white">
                      {/* User Header Profile Card */}
                      <div className="flex items-center gap-3 px-2 pb-3.5 border-b border-white/10 mb-2.5">
                        <div className="relative h-11 w-11 shrink-0 rounded-full border border-[#D4C3A3]/40 bg-[#342417] overflow-hidden flex items-center justify-center text-white text-sm font-bold shadow-inner">
                          {user.avatar ? (
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
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-[#4F5B48]" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-[#D4C3A3] leading-none uppercase tracking-widest mb-1.5 opacity-80">Account Signed In</p>
                          <p className="text-sm font-extrabold text-white truncate leading-tight">{user.name}</p>
                          <p className="text-xs text-white/50 truncate leading-none mt-1">{user.email}</p>
                        </div>
                      </div>
                      
                      {/* Overview */}
                      <Link
                        href="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      >
                        <LayoutGrid className="h-4.5 w-4.5 text-[#D4C3A3] group-hover:text-[#FFC71E] transition-colors" />
                        <span>Overview</span>
                      </Link>

                      {/* Profile */}
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      >
                        <User className="h-4.5 w-4.5 text-[#D4C3A3] group-hover:text-[#FFC71E] transition-colors" />
                        <span>My Profile</span>
                      </Link>

                      {/* Settings */}
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                      >
                        <Settings className="h-4.5 w-4.5 text-[#D4C3A3] group-hover:text-[#FFC71E] transition-colors" />
                        <span>Settings</span>
                      </Link>

                      {/* Expand to Full Sidebar Menu */}
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          setSidebarOpen(true);
                        }}
                        className="group flex items-center justify-between w-full px-4 py-3 text-xs font-black uppercase tracking-wider text-[#342417] bg-gradient-to-r from-[#D4C3A3] to-[#BFA98A] hover:from-white hover:to-[#EBE4D8] transition-all duration-300 cursor-pointer rounded-xl my-2 shadow-[0_4px_15px_rgba(212,195,163,0.25)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.4)]"
                      >
                        <span className="flex items-center gap-2">
                          <Menu className="h-4 w-4 transition-transform group-hover:rotate-90 duration-300" />
                          Full Sidebar Menu
                        </span>
                        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1 duration-200" />
                      </button>

                      {/* Logout */}
                      <div className="border-t border-white/10 mt-1.5 pt-2">
                        <button
                          onClick={async () => {
                            setDropdownOpen(false);
                            await logout();
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all cursor-pointer rounded-xl"
                        >
                          <LogOut className="h-4.5 w-4.5 text-red-400" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-[#342417] px-6 py-2 text-sm font-bold text-white shadow-md transition-all hover:bg-[#251910] hover:-translate-y-0.5"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate hover:text-ink focus:outline-hidden md:hidden"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="border-t border-mist bg-paper px-4 pb-6 pt-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {siteConfig.nav.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-4 py-3 text-sm font-medium text-slate transition-colors hover:bg-sand hover:text-ember"
                >
                  {item.label}
                </Link>
              ))}

              <p className="px-4 pb-1 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate/50">
                Services
              </p>
              {SERVICE_LINKS.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate transition-colors hover:bg-sand hover:text-ember"
                  >
                    <Icon className="h-4 w-4 text-[#B0892E]" />
                    {s.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-mist pt-4">
              {isAuthenticated && user ? (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setSidebarOpen(true);
                  }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-sand text-left w-full cursor-pointer"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#342417]/20 bg-[#342417] text-xs font-bold text-white">
                    {user.avatar ? (
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
                  <div>
                    <p className="text-sm font-bold text-[#342417]">{user.name}</p>
                    <p className="text-[11px] text-[#5C4D3C]/60">Account Settings & Menu →</p>
                  </div>
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-slate transition-colors hover:bg-sand"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="w-full rounded-xl bg-ember py-2.5 text-center text-sm font-bold text-white shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Sidebar Drawer Component */}
      <SidebarMenu isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}
