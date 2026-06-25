"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site.config";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-mist/60 bg-paper/80 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <span className="font-sans text-2xl font-extrabold tracking-tight text-ink">
            Nir<span className="text-ember">Mix</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 text-sm font-medium text-slate md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`rounded-full px-4 py-2 transition-colors ${
                item.highlight
                  ? "bg-ember/10 font-semibold text-ember"
                  : "hover:text-ember"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-4 md:flex">
          <button
            type="button"
            className="rounded-full p-2 text-slate transition-colors hover:bg-sand hover:text-ink"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            href={siteConfig.cta.href}
            className="rounded-full bg-ember px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-ember/15 transition-all hover:-translate-y-0.5 hover:bg-ember/90"
          >
            {siteConfig.cta.label}
          </Link>
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
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-mist pt-4">
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl py-2.5 text-center text-sm font-semibold text-slate transition-colors hover:bg-sand"
            >
              Sign In
            </Link>
            <Link
              href={siteConfig.cta.href}
              onClick={() => setMobileOpen(false)}
              className="w-full rounded-xl bg-ember py-2.5 text-center text-sm font-bold text-white shadow-md"
            >
              {siteConfig.cta.label}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
