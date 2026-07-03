"use client";

import { PORTFOLIO_CATEGORIES } from "@/lib/portfolio-schemas";
import { inputCls, labelCls, errorCls, ACCENT } from "../ui";
import { CATEGORY_ICONS, type StepProps } from "./shared";

const AVAILABILITY = ["Available", "Busy", "Not taking work"];

export function StepIntro({ form, update, errors }: StepProps) {
  return (
    <div className="space-y-7">
      {/* Category picker — the single decision that drives the rest of the wizard */}
      <div>
        <label className={labelCls}>
          I am a<span className="ml-0.5 text-[#B05B33]">*</span>
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.icon] ?? CATEGORY_ICONS.Briefcase;
            const selected = form.category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => update({ category: cat.id })}
                className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all ${
                  selected
                    ? "border-[#B05B33] bg-[#B05B33]/[0.05] shadow-[0_0_0_1px_rgba(176,91,51,0.35)]"
                    : "border-[#E4DCD0] bg-white hover:border-[#C9B79F] hover:shadow-sm"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    selected ? "text-white" : "bg-[#F5F1EA] text-[#8A7A67]"
                  }`}
                  style={selected ? { backgroundColor: ACCENT } : undefined}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-[#2E2116]">{cat.label}</span>
                  <span className="mt-0.5 block text-[11px] leading-snug text-[#8A7A67]">
                    {cat.tagline}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        {errors.category && <p className={errorCls}>{errors.category}</p>}
      </div>

      {/* Headline */}
      <div>
        <label className={labelCls}>
          Professional headline<span className="ml-0.5 text-[#B05B33]">*</span>
        </label>
        <input
          type="text"
          value={form.headline}
          onChange={(e) => update({ headline: e.target.value })}
          placeholder="e.g. Licensed structural engineer — earthquake-safe homes"
          maxLength={90}
          className={inputCls}
        />
        {errors.headline && <p className={errorCls}>{errors.headline}</p>}
      </div>

      {/* Bio */}
      <div>
        <label className={labelCls}>Professional summary</label>
        <textarea
          value={form.bio}
          onChange={(e) => update({ bio: e.target.value })}
          rows={4}
          placeholder="Tell clients about your experience, approach, and what makes your work stand out."
          className={`${inputCls} resize-y leading-relaxed`}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {/* Experience */}
        <div>
          <label className={labelCls}>Years of experience</label>
          <input
            type="number"
            min={0}
            max={60}
            value={form.experienceYears}
            onChange={(e) => update({ experienceYears: e.target.value })}
            placeholder="e.g. 6"
            className={inputCls}
          />
        </div>

        {/* Availability */}
        <div>
          <label className={labelCls}>Availability</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABILITY.map((opt) => {
              const on = form.availability === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => update({ availability: opt })}
                  className={`rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                    on
                      ? "border-[#B05B33] bg-[#B05B33]/[0.06] text-[#3A2C1E]"
                      : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
