"use client";

import { useAuth } from "@/lib/auth-context";
import { Home, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WelcomeHeaderProps {
  onStartListing: () => void;
}

export function WelcomeHeader({ onStartListing }: WelcomeHeaderProps) {
  const { user } = useAuth();

  return (
    <section className="mb-8">
      {/* Dashboard Label */}
      <div className="mb-1 flex items-center gap-2">
        <span className="h-[2px] w-5 bg-[#5A7A50]" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#5A7A50]">
          Dashboard
        </span>
      </div>

      {/* Welcome */}
      <h1 className="text-2xl font-extrabold text-[#342417] sm:text-3xl">
        Welcome back, {user?.name?.split(" ")[0] || "User"}
      </h1>
      <p className="mt-1 text-sm text-[#5C4D3C]/70 font-medium">
        What would you like to do today?
      </p>

      {/* CTA Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* For Owners */}
        <div className="rounded-2xl border border-[#E0D4C5]/70 bg-[#F0E5DA]/40 p-6 transition hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#342417]/10">
              <Home className="h-4 w-4 text-[#342417]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C4D3C]/70">
              For Owners
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-[#342417]">
            Post a Property
          </h3>
          <p className="mt-1 text-xs text-[#5C4D3C]/70 leading-relaxed">
            Sell or rent your home, land or commercial space — reach thousands
            of verified buyers.
          </p>
          <button
            type="button"
            onClick={onStartListing}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-[#342417] bg-transparent px-4 py-2 text-xs font-bold text-[#342417] transition hover:bg-[#342417] hover:text-white cursor-pointer"
          >
            Start listing <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        {/* For Professionals */}
        <div className="rounded-2xl border border-[#E0D4C5]/70 bg-[#F0E5DA]/40 p-6 transition hover:shadow-md">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5A7A50]/10">
              <Building2 className="h-4 w-4 text-[#5A7A50]" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5C4D3C]/70">
              For Professionals
            </span>
          </div>
          <h3 className="text-lg font-extrabold text-[#342417]">
            Offer Services
          </h3>
          <p className="mt-1 text-xs text-[#5C4D3C]/70 leading-relaxed">
            Architect, engineer, agent or contractor — create a profile and get
            matched with clients.
          </p>
          <Link
            href="/dashboard/create-portfolio"
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-[#5A7A50] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#4A6A40]"
          >
            Create portfolio <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
