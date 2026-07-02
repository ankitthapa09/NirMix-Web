"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  MapPin,
  Home,
  Info,
  ListChecks,
  ChevronRight,
  ShieldCheck,
  Gauge,
  Building2,
} from "lucide-react";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";

const ACCENT = "#B05B33";

// Rough indicative rates (NPR). Heuristic only — not a formal appraisal.
const SQFT_RATE: Record<string, number> = {
  Kathmandu: 9000,
  Lalitpur: 8500,
  Bhaktapur: 6500,
  Kaski: 5500,
  Chitwan: 4500,
  Other: 4000,
};
const AANA_RATE: Record<string, number> = {
  Kathmandu: 4000000,
  Lalitpur: 3500000,
  Bhaktapur: 2000000,
  Kaski: 1500000,
  Chitwan: 1200000,
  Other: 1000000,
};

const TYPE_MULT: Record<string, number> = { House: 1.0, Apartment: 1.05, Land: 1.0 };
const AGE_FACTOR: Record<string, number> = { "Brand new": 1.0, "1–5 years": 0.95, "5–10 years": 0.88, "10+ years": 0.78 };
const CONDITION_FACTOR: Record<string, number> = { Excellent: 1.05, Good: 1.0, Average: 0.92, "Needs work": 0.8 };

const inputCls =
  "w-full rounded-xl border border-[#E0D4C5] bg-[#FAF7F2] px-3.5 py-2.5 text-sm font-semibold text-[#342417] outline-none transition focus:border-[#B05B33]/45 focus:bg-white focus:ring-2 focus:ring-[#B05B33]/10";

const fmt = (n: number) => n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
const crore = (n: number) =>
  n >= 10000000 ? `NPR ${(n / 10000000).toFixed(2)} Cr` : n >= 100000 ? `NPR ${(n / 100000).toFixed(2)} Lakh` : `NPR ${fmt(n)}`;

const HERO_CHIPS = [
  { icon: Gauge, label: "Indicative estimate" },
  { icon: MapPin, label: "District rates" },
  { icon: ShieldCheck, label: "Free to use" },
];

const FACTORS = [
  "Exact location, road width & access",
  "Property type, size & built-up area",
  "Age and overall condition",
  "Amenities, finishing & parking",
  "Current local market demand",
];

function Field({ label, children, icon: Icon }: { label: string; children: React.ReactNode; icon?: typeof Home }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-[#5C4D3C]/80">
        {Icon && <Icon className="h-3.5 w-3.5 text-[#5C4D3C]/45" />}
        {label}
      </span>
      {children}
    </label>
  );
}

export function ValuationPage() {
  const [district, setDistrict] = useState("Kathmandu");
  const [type, setType] = useState("House");
  const [area, setArea] = useState("");
  const [age, setAge] = useState("1–5 years");
  const [condition, setCondition] = useState("Good");

  const isLand = type === "Land";
  const a = Number(area) || 0;

  const base = isLand
    ? a * AANA_RATE[district]
    : a * SQFT_RATE[district] * TYPE_MULT[type] * AGE_FACTOR[age];
  const value = base * CONDITION_FACTOR[condition];
  const show = a > 0;

  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-ember/20 selection:text-ember">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C]/60">
          <Link href="/" className="transition-colors hover:text-[#342417]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#342417]">Property Valuation</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-[#E8DECF] bg-gradient-to-br from-[#FBF7EF] via-white to-[#F7EBE3] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-6" style={{ backgroundColor: ACCENT }} />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em]" style={{ color: ACCENT }}>
              Property Valuation
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-[#342417] sm:text-4xl">
            What&apos;s your property worth?
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#5C4D3C]/75 sm:text-base">
            Get an instant indicative market estimate based on location, type, size and condition.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {HERO_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D4C5] bg-white/70 px-3 py-1.5 text-[11px] font-bold text-[#5C4D3C]"
                >
                  <Icon className="h-3.5 w-3.5" style={{ color: ACCENT }} />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Form */}
          <section className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-[#E8DECF] bg-white shadow-sm">
              <div
                className="flex items-center gap-3.5 border-b border-[#EFE7D8] px-5 py-5 sm:px-7"
                style={{ background: `linear-gradient(110deg, ${ACCENT}14, transparent 70%)` }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${ACCENT}1f`, color: ACCENT }}
                >
                  <Building2 className="h-6 w-6" />
                </span>
                <div>
                  <h2 className="text-lg font-extrabold text-[#342417] sm:text-xl">Property details</h2>
                  <p className="mt-0.5 text-xs text-[#5C4D3C]/70 sm:text-sm">Fill these in for your estimate.</p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field label="District" icon={MapPin}>
                    <select value={district} onChange={(e) => setDistrict(e.target.value)} className={`${inputCls} cursor-pointer`}>
                      {Object.keys(SQFT_RATE).map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Property type" icon={Home}>
                    <select value={type} onChange={(e) => setType(e.target.value)} className={`${inputCls} cursor-pointer`}>
                      {Object.keys(TYPE_MULT).map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label={isLand ? "Land area" : "Built-up area"}>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="decimal"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder={isLand ? "e.g. 4" : "e.g. 1500"}
                        className={inputCls}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5C4D3C]/45">
                        {isLand ? "Aana" : "sq.ft"}
                      </span>
                    </div>
                  </Field>
                  {!isLand && (
                    <Field label="Age of property">
                      <select value={age} onChange={(e) => setAge(e.target.value)} className={`${inputCls} cursor-pointer`}>
                        {Object.keys(AGE_FACTOR).map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </select>
                    </Field>
                  )}
                  <Field label="Condition">
                    <select value={condition} onChange={(e) => setCondition(e.target.value)} className={`${inputCls} cursor-pointer`}>
                      {Object.keys(CONDITION_FACTOR).map((x) => (
                        <option key={x}>{x}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Info blocks */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#E8DECF] bg-[#FBF7EF]/60 p-4">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/60">
                      <Info className="h-3.5 w-3.5" /> How it&apos;s estimated
                    </p>
                    <p className="text-[13px] leading-relaxed text-[#5C4D3C]/80">
                      Your area is multiplied by a typical district rate for the property type, then adjusted for age and
                      condition. The range reflects ±12% market variance.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-[#E8DECF] bg-[#FBF7EF]/60 p-4">
                    <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/60">
                      <ListChecks className="h-3.5 w-3.5" /> What affects your value
                    </p>
                    <ul className="space-y-1.5">
                      {FACTORS.map((f) => (
                        <li key={f} className="flex gap-2 text-[13px] leading-snug text-[#5C4D3C]/80">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#5C4D3C]/40" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Result (sticky on desktop) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-[#E8DECF] bg-white shadow-sm">
              <div className="border-b border-[#EFE7D8] px-5 py-4">
                <p className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/55">
                  <TrendingUp className="h-3.5 w-3.5" /> Estimated value
                </p>
              </div>
              <div className="p-5">
                {show ? (
                  <>
                    <p className="text-3xl font-extrabold tracking-tight" style={{ color: ACCENT }}>
                      {crore(value)}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#5C4D3C]/70">
                      Range {crore(value * 0.88)} – {crore(value * 1.12)}
                    </p>
                    <div className="mt-3 rounded-xl border border-[#E8DECF] bg-[#FBF7EF] px-3.5 py-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-[#5C4D3C]/55">Exact figure</p>
                      <p className="mt-0.5 text-sm font-extrabold text-[#342417]">NPR {fmt(Math.round(value))}</p>
                    </div>
                  </>
                ) : (
                  <p className="py-6 text-center text-sm font-semibold text-[#5C4D3C]/60">
                    Enter your {isLand ? "land area" : "built-up area"} to see the estimate.
                  </p>
                )}

                <p className="mt-4 text-[11px] leading-relaxed text-[#5C4D3C]/55">
                  Indicative only — actual value depends on exact location, access, amenities and the live market. For a
                  precise figure, consult a licensed valuator.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
