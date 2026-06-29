"use client";

import { Sparkles, Lightbulb, Activity, ArrowRight } from "lucide-react";
import Link from "next/link";

export function SidebarWidgets() {
  return (
    <aside className="flex flex-col gap-5">
      {/* ── Complete Your Profile ── */}
      <div className="rounded-2xl border border-[#E0D4C5]/70 bg-white p-5">
        <div className="flex items-start gap-3 mb-4">
          <Sparkles className="h-5 w-5 shrink-0 text-[#5A7A50] mt-0.5" />
          <div>
            <h3 className="text-sm font-extrabold text-[#342417]">
              Complete your profile
            </h3>
            <p className="mt-0.5 text-[11px] text-[#5C4D3C]/70">
              Add a photo and bio to increase trust by 4×.
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex items-center justify-between text-[10px] font-bold text-[#5C4D3C]/60 mb-1">
            <span>65% complete</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#E0D4C5]/50">
            <div
              className="h-full rounded-full bg-[#5A7A50] transition-all duration-500"
              style={{ width: "65%" }}
            />
          </div>
        </div>

        <Link
          href="/dashboard/profile"
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#342417] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#251910]"
        >
          Finish portfolio
        </Link>
      </div>

      {/* ── Tips For You ── */}
      <div className="rounded-2xl border border-[#E0D4C5]/70 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="h-4 w-4 text-[#C4A96A]" />
          <h3 className="text-sm font-extrabold text-[#342417]">
            Tips for you
          </h3>
        </div>

        <div className="space-y-4">
          {/* Tip 1 */}
          <div>
            <p className="text-xs font-bold text-[#342417]">
              Complete your profile
            </p>
            <p className="text-[11px] text-[#5C4D3C]/60 mt-0.5">
              Verified profiles get 3× more inquiries.
            </p>
            <Link
              href="/dashboard/profile"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#C4A96A] hover:text-[#B09850] transition"
            >
              Finish profile <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Tip 2 */}
          <div>
            <p className="text-xs font-bold text-[#342417]">
              Add cover photos
            </p>
            <p className="text-[11px] text-[#5C4D3C]/60 mt-0.5">
              Listings with 5+ photos sell faster.
            </p>
            <Link
              href="/dashboard/my-listings"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#C4A96A] hover:text-[#B09850] transition"
            >
              Edit listings <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Tip 3 */}
          <div>
            <p className="text-xs font-bold text-[#342417]">
              Try Auto Valuation
            </p>
            <p className="text-[11px] text-[#5C4D3C]/60 mt-0.5">
              Get a free market estimate in seconds.
            </p>
            <Link
              href="/dashboard/valuation"
              className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-[#C4A96A] hover:text-[#B09850] transition"
            >
              Estimate now <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Recent Activity ── */}
      <div className="rounded-2xl border border-[#E0D4C5]/70 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-4 w-4 text-[#D94F3B]" />
          <h3 className="text-sm font-extrabold text-[#342417]">
            Recent activity
          </h3>
        </div>

        <ul className="space-y-3">
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5A7A50]" />
            <p className="text-[11px] text-[#5C4D3C]/80 leading-relaxed">
              Your listing &ldquo;Bhaisepati Duplex&rdquo; got{" "}
              <strong className="text-[#342417]">12 new views</strong> today.
            </p>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5A7A50]" />
            <p className="text-[11px] text-[#5C4D3C]/80 leading-relaxed">
              Sita Pradhan saved your listing in Kupondole.
            </p>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#5A7A50]" />
            <p className="text-[11px] text-[#5C4D3C]/80 leading-relaxed">
              New bid received on Tender{" "}
              <strong className="text-[#342417]">#TND-204</strong>.
            </p>
          </li>
        </ul>
      </div>
    </aside>
  );
}
