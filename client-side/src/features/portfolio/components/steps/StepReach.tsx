"use client";

import { useState } from "react";
import { X, Check, Search, Globe, Link2, AtSign, MessageCircle, Play, Music2 } from "lucide-react";
import { ALL_DISTRICTS, LANGUAGE_OPTIONS } from "@/lib/nepal-geo";
import { EMPTY_SOCIALS, type PortfolioSocials } from "@/lib/portfolio-api";
import { inputCls, labelCls, ACCENT } from "../ui";
import type { StepProps } from "./shared";

const CONTACT_METHODS = ["Phone", "Viber", "WhatsApp", "Email"];
const FEE_MODELS = ["Hourly", "Per-project", "% Commission", "Negotiable"];

const SOCIAL_FIELDS: { key: keyof PortfolioSocials; label: string; icon: typeof Globe; placeholder: string }[] = [
  { key: "website", label: "Website", icon: Globe, placeholder: "https://yoursite.com.np" },
  { key: "facebook", label: "Facebook", icon: Link2, placeholder: "facebook.com/username" },
  { key: "instagram", label: "Instagram", icon: AtSign, placeholder: "@username" },
  { key: "linkedin", label: "LinkedIn", icon: Link2, placeholder: "linkedin.com/in/username" },
  { key: "youtube", label: "YouTube", icon: Play, placeholder: "youtube.com/@channel" },
  { key: "tiktok", label: "TikTok", icon: Music2, placeholder: "@username" },
  { key: "viber", label: "Viber", icon: MessageCircle, placeholder: "+977 98XXXXXXXX" },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, placeholder: "+977 98XXXXXXXX" },
  { key: "behance", label: "Behance / Portfolio URL", icon: Link2, placeholder: "behance.net/username" },
];

export function StepReach({ form, update }: StepProps) {
  const [query, setQuery] = useState("");

  const toggleArea = (d: string) => {
    const on = form.serviceAreas.includes(d);
    update({ serviceAreas: on ? form.serviceAreas.filter((x) => x !== d) : [...form.serviceAreas, d] });
  };
  const toggleLang = (l: string) => {
    const on = form.languages.includes(l);
    update({ languages: on ? form.languages.filter((x) => x !== l) : [...form.languages, l] });
  };
  const setSocial = (key: keyof PortfolioSocials, value: string) =>
    update({ socials: { ...(form.socials ?? EMPTY_SOCIALS), [key]: value } });

  const matches = query.trim()
    ? ALL_DISTRICTS.filter((d) => d.toLowerCase().includes(query.trim().toLowerCase()))
    : ALL_DISTRICTS;

  return (
    <div className="space-y-8">
      {/* Service areas */}
      <div>
        <label className={labelCls}>Service areas (districts you cover)</label>
        {form.serviceAreas.length > 0 && (
          <div className="mb-2.5 flex flex-wrap gap-2">
            {form.serviceAreas.map((d) => (
              <span key={d} className="inline-flex items-center gap-1.5 rounded-full bg-[#B05B33]/[0.08] px-3 py-1.5 text-[12px] font-semibold text-[#3A2C1E]">
                {d}
                <button type="button" onClick={() => toggleArea(d)} className="text-[#B05B33] hover:text-[#8a4526]">
                  <X className="h-3 w-3 stroke-[3]" />
                </button>
              </span>
            ))}
          </div>
        )}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8A78]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search districts…"
            className={`${inputCls} pl-9`}
          />
        </div>
        <div className="flex max-h-44 flex-wrap gap-2 overflow-y-auto rounded-xl border border-[#EAE3D8] bg-[#FAF7F2] p-3">
          {matches.map((d) => {
            const on = form.serviceAreas.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleArea(d)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  on ? "border-[#B05B33] bg-[#B05B33]/[0.08] text-[#3A2C1E]" : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                }`}
              >
                {on && <Check className="h-3 w-3 stroke-[3]" style={{ color: ACCENT }} />}
                {d}
              </button>
            );
          })}
          {matches.length === 0 && <p className="px-1 py-2 text-[12px] text-[#8A7A67]">No districts match “{query}”.</p>}
        </div>
      </div>

      {/* Languages */}
      <div>
        <label className={labelCls}>Languages spoken</label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((l) => {
            const on = form.languages.includes(l);
            return (
              <button
                key={l}
                type="button"
                onClick={() => toggleLang(l)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                  on ? "border-[#B05B33] bg-[#B05B33]/[0.08] text-[#3A2C1E]" : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                }`}
              >
                {on && <Check className="h-3 w-3 stroke-[3]" style={{ color: ACCENT }} />}
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Contact + fees */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Preferred contact</label>
          <div className="flex flex-wrap gap-2">
            {CONTACT_METHODS.map((m) => {
              const on = form.preferredContact === m;
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => update({ preferredContact: m })}
                  className={`rounded-xl border px-3.5 py-2.5 text-[13px] font-semibold transition-all ${
                    on ? "border-[#B05B33] bg-[#B05B33]/[0.06] text-[#3A2C1E]" : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Fee model</label>
            <div className="relative">
              <select
                value={form.feeModel}
                onChange={(e) => update({ feeModel: e.target.value })}
                className={`${inputCls} cursor-pointer appearance-none ${!form.feeModel ? "text-[#9A8A78]" : ""}`}
              >
                <option value="" disabled>Select</option>
                {FEE_MODELS.map((f) => <option key={f} value={f} className="text-[#2E2116]">{f}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Amount (NPR)</label>
            <input type="number" value={form.feeAmount} onChange={(e) => update({ feeAmount: e.target.value })} placeholder="Optional" className={inputCls} />
          </div>
        </div>
      </div>

      {/* Socials */}
      <div>
        <h3 className="mb-1 text-sm font-bold text-[#2E2116]">Social & web links</h3>
        <p className="mb-3 text-[12px] text-[#8A7A67]">All optional — add the ones clients should find you on.</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SOCIAL_FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
            <div key={key}>
              <label className={labelCls}>{label}</label>
              <div className="relative">
                <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8A78]" />
                <input
                  type="text"
                  value={form.socials?.[key] ?? ""}
                  onChange={(e) => setSocial(key, e.target.value)}
                  placeholder={placeholder}
                  className={`${inputCls} pl-9`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
