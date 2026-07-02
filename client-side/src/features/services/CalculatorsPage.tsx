"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Layers,
  Calculator,
  Box,
  Sigma,
  Banknote,
  Ruler,
  Grid3x3,
  Sparkles,
  ChevronRight,
  Info,
  ListChecks,
  MapPin,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";

/* ──────────────── shared field + result helpers ──────────────── */

const inputCls =
  "w-full rounded-xl border border-[#E0D4C5] bg-[#FAF7F2] px-3.5 py-2.5 text-sm font-semibold text-[#342417] outline-none transition focus:border-[#B0892E]/50 focus:bg-white focus:ring-2 focus:ring-[#B0892E]/10";

function Num({
  label,
  value,
  set,
  unit,
  placeholder,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  unit?: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#5C4D3C]/80">{label}</span>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => set(e.target.value)}
          placeholder={placeholder}
          className={inputCls}
        />
        {unit && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#5C4D3C]/45">
            {unit}
          </span>
        )}
      </div>
    </label>
  );
}

function Choice({
  label,
  value,
  set,
  options,
}: {
  label: string;
  value: string;
  set: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-[#5C4D3C]/80">{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)} className={`${inputCls} cursor-pointer`}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

type Row = { label: string; value: string };

// Renders the first row as an emphasized hero metric, the rest as a compact grid.
function Results({ rows, accent }: { rows: Row[]; accent: string }) {
  if (rows.length === 0) {
    return (
      <div className="mt-5 rounded-2xl border border-dashed border-[#E0D4C5] bg-[#FBF7EF]/50 px-4 py-8 text-center">
        <p className="text-sm font-semibold text-[#5C4D3C]/60">Enter the values above to see your results.</p>
      </div>
    );
  }
  const [hero, ...rest] = rows;
  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-2xl border p-5" style={{ borderColor: `${accent}33`, backgroundColor: `${accent}0d` }}>
        <p className="text-[11px] font-bold uppercase tracking-wider text-[#5C4D3C]/55">{hero.label}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl" style={{ color: accent }}>
          {hero.value}
        </p>
      </div>
      {rest.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {rest.map((r) => (
            <div key={r.label} className="rounded-xl border border-[#E8DECF] bg-[#FBF7EF] p-3.5">
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5C4D3C]/55">{r.label}</p>
              <p className="mt-0.5 text-base font-extrabold text-[#342417]">{r.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const fmt = (n: number, d = 0) =>
  Number.isFinite(n)
    ? n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d })
    : "—";
const npr = (n: number) => `NPR ${fmt(Math.round(n))}`;

type CalcProps = { accent: string };

/* ──────────────── individual calculators ──────────────── */

function MaterialEstimator({ accent }: CalcProps) {
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("1");
  const total = (Number(area) || 0) * (Number(floors) || 1);
  const rows: Row[] = total > 0
    ? [
        { label: "Cement", value: `${fmt(total * 0.4)} bags` },
        { label: "Steel", value: `${fmt(total * 4)} kg` },
        { label: "Sand", value: `${fmt(total * 0.816)} cu.ft` },
        { label: "Aggregate", value: `${fmt(total * 1.608)} cu.ft` },
        { label: "Bricks", value: `${fmt(total * 8)} nos` },
        { label: "Total area", value: `${fmt(total)} sq.ft` },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Num label="Built-up area (per floor)" value={area} set={setArea} unit="sq.ft" placeholder="e.g. 1200" />
        <Num label="Number of floors" value={floors} set={setFloors} placeholder="e.g. 2" />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function CostCalculator({ accent }: CalcProps) {
  const RATES: Record<string, number> = { "Basic finish": 2000, "Standard finish": 2800, "Premium finish": 3800 };
  const [area, setArea] = useState("");
  const [floors, setFloors] = useState("1");
  const [grade, setGrade] = useState("Standard finish");
  const total = (Number(area) || 0) * (Number(floors) || 1);
  const rate = RATES[grade];
  const cost = total * rate;
  const rows: Row[] = total > 0
    ? [
        { label: "Estimated cost", value: npr(cost) },
        { label: "Low estimate", value: npr(cost * 0.92) },
        { label: "High estimate", value: npr(cost * 1.08) },
        { label: "Rate used", value: `NPR ${fmt(rate)}/sq.ft` },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Num label="Built-up area (per floor)" value={area} set={setArea} unit="sq.ft" placeholder="e.g. 1200" />
        <Num label="Number of floors" value={floors} set={setFloors} placeholder="e.g. 2" />
        <Choice label="Finish grade" value={grade} set={setGrade} options={Object.keys(RATES)} />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function ConcreteMix({ accent }: CalcProps) {
  const MIX: Record<string, [number, number, number]> = {
    "M20 (1:1.5:3)": [1, 1.5, 3],
    "M25 (1:1:2)": [1, 1, 2],
    "M30 (1:0.75:1.5)": [1, 0.75, 1.5],
  };
  const [vol, setVol] = useState("");
  const [grade, setGrade] = useState("M20 (1:1.5:3)");
  const v = Number(vol) || 0;
  const [c, s, a] = MIX[grade];
  const sum = c + s + a;
  const dry = v * 1.54;
  const rows: Row[] = v > 0
    ? [
        { label: "Cement", value: `${fmt((dry * (c / sum)) / 0.0347)} bags` },
        { label: "Sand", value: `${fmt(dry * (s / sum), 2)} m³` },
        { label: "Aggregate", value: `${fmt(dry * (a / sum), 2)} m³` },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Num label="Concrete volume" value={vol} set={setVol} unit="m³" placeholder="e.g. 10" />
        <Choice label="Grade (nominal mix)" value={grade} set={setGrade} options={Object.keys(MIX)} />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function BeamLoad({ accent }: CalcProps) {
  const FCK: Record<string, number> = { M20: 20, M25: 25, M30: 30 };
  const [span, setSpan] = useState("");
  const [b, setB] = useState("");
  const [d, setD] = useState("");
  const [grade, setGrade] = useState("M20");
  const L = Number(span) || 0;
  const bw = Number(b) || 0;
  const dd = Number(d) || 0;
  const muKnm = (0.138 * FCK[grade] * bw * dd * dd) / 1e6;
  const w = L > 0 ? (8 * muKnm) / (L * L) : 0;
  const valid = L > 0 && bw > 0 && dd > 0;
  const rows: Row[] = valid
    ? [
        { label: "Safe load (UDL)", value: `${fmt(w, 1)} kN/m` },
        { label: "Moment capacity", value: `${fmt(muKnm, 1)} kN·m` },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Num label="Clear span (L)" value={span} set={setSpan} unit="m" placeholder="e.g. 4" />
        <Choice label="Concrete grade" value={grade} set={setGrade} options={Object.keys(FCK)} />
        <Num label="Beam width (b)" value={b} set={setB} unit="mm" placeholder="e.g. 230" />
        <Num label="Effective depth (d)" value={d} set={setD} unit="mm" placeholder="e.g. 400" />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function EmiCalculator({ accent }: CalcProps) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const P = Number(principal) || 0;
  const i = (Number(rate) || 0) / 1200;
  const n = (Number(years) || 0) * 12;
  const emi = P > 0 && i > 0 && n > 0 ? (P * i * (1 + i) ** n) / ((1 + i) ** n - 1) : 0;
  const total = emi * n;
  const rows: Row[] = emi > 0
    ? [
        { label: "Monthly EMI", value: npr(emi) },
        { label: "Total interest", value: npr(total - P) },
        { label: "Total payment", value: npr(total) },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Num label="Loan amount" value={principal} set={setPrincipal} unit="NPR" placeholder="e.g. 5000000" />
        <Num label="Interest rate (p.a.)" value={rate} set={setRate} unit="%" placeholder="e.g. 11" />
        <Num label="Tenure" value={years} set={setYears} unit="yrs" placeholder="e.g. 20" />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function AreaConverter({ accent }: CalcProps) {
  const TO_SQFT: Record<string, number> = {
    "Sq. ft": 1,
    "Sq. m": 10.7639,
    Ropani: 5476,
    Aana: 342.25,
    Paisa: 85.5625,
    Daam: 21.390625,
    Bigha: 72900,
    Kattha: 3645,
    Dhur: 182.25,
  };
  const [value, setValue] = useState("");
  const [unit, setUnit] = useState("Aana");
  const sqft = (Number(value) || 0) * TO_SQFT[unit];
  const out = (u: string) => fmt(sqft / TO_SQFT[u], 3);
  const rows: Row[] = sqft > 0
    ? [
        { label: "Sq. ft", value: out("Sq. ft") },
        { label: "Sq. m", value: out("Sq. m") },
        { label: "Ropani", value: out("Ropani") },
        { label: "Aana", value: out("Aana") },
        { label: "Bigha", value: out("Bigha") },
        { label: "Kattha", value: out("Kattha") },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Num label="Value" value={value} set={setValue} placeholder="e.g. 4" />
        <Choice label="From unit" value={unit} set={setUnit} options={Object.keys(TO_SQFT)} />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function BrickEstimator({ accent }: CalcProps) {
  const [len, setLen] = useState("");
  const [ht, setHt] = useState("");
  const [thickness, setThickness] = useState("115 mm (half brick)");
  const t = thickness.startsWith("230") ? 0.23 : 0.115;
  const vol = (Number(len) || 0) * (Number(ht) || 0) * t;
  const rows: Row[] = vol > 0
    ? [
        { label: "Bricks", value: `${fmt(vol * 500)} nos` },
        { label: "Mortar", value: `${fmt(vol * 0.3, 2)} m³` },
        { label: "Wall volume", value: `${fmt(vol, 2)} m³` },
      ]
    : [];
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Num label="Wall length" value={len} set={setLen} unit="m" placeholder="e.g. 6" />
        <Num label="Wall height" value={ht} set={setHt} unit="m" placeholder="e.g. 3" />
        <Choice
          label="Wall thickness"
          value={thickness}
          set={setThickness}
          options={["115 mm (half brick)", "230 mm (full brick)"]}
        />
      </div>
      <Results rows={rows} accent={accent} />
    </>
  );
}

function ComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E0D4C5] bg-[#FBF7EF]/60 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6B8E5A]/12 text-[#6B8E5A]">
        <Sparkles className="h-6 w-6" />
      </span>
      <h3 className="mt-3 text-lg font-extrabold text-[#342417]">AI Advisor — coming soon</h3>
      <p className="mt-1 max-w-sm text-sm text-[#5C4D3C]/70">
        Ask anything about the National Building Code, materials, and costs. We&apos;re putting the finishing touches on it.
      </p>
    </div>
  );
}

/* ──────────────── registry + page ──────────────── */

interface CalcDef {
  id: string;
  name: string;
  tag: string;
  group: string;
  desc: string;
  icon: typeof Calculator;
  accent: string;
  Component: (props: CalcProps) => React.ReactElement;
  about: string;
  assumptions: string[];
  comingSoon?: boolean;
}

const CALCS: CalcDef[] = [
  {
    id: "material",
    name: "Material Estimator",
    tag: "Most used",
    group: "Construction & materials",
    desc: "Cement, sand, aggregate & steel for any built-up area.",
    icon: Layers,
    accent: "#C99A2E",
    Component: MaterialEstimator,
    about:
      "Applies standard RCC thumb rules per built-up area: cement 0.4 bag, sand 0.816 cu.ft, aggregate 1.608 cu.ft, steel 4 kg and 8 bricks per sq.ft, scaled by total area (area × floors).",
    assumptions: ["Framed RCC structure on average soil", "Quantities exclude wastage — add ~3–5% buffer", "For G+ structures, foundations may need more steel"],
  },
  {
    id: "cost",
    name: "Cost Calculator",
    tag: "Budgeting",
    group: "Construction & materials",
    desc: "Quick build-cost estimate by area and finish grade.",
    icon: Calculator,
    accent: "#5A7A50",
    Component: CostCalculator,
    about:
      "Multiplies total built-up area by a typical per-sq.ft construction rate for the chosen finish grade, then shows an ±8% range.",
    assumptions: ["Basic 2,000 · Standard 2,800 · Premium 3,800 NPR/sq.ft", "Covers structure + finishing, excludes land cost", "Kathmandu-valley indicative rates"],
  },
  {
    id: "concrete",
    name: "Concrete Mix",
    tag: "Site ready",
    group: "Construction & materials",
    desc: "Design an M20–M30 mix for the volume you need.",
    icon: Box,
    accent: "#5B7B9A",
    Component: ConcreteMix,
    about:
      "Wet volume × 1.54 gives the dry volume, which is split by the nominal mix ratio. One cement bag = 0.0347 m³ (50 kg).",
    assumptions: ["Nominal mixes (M20 = 1:1.5:3, etc.)", "No admixtures; add wastage on site", "For critical work, use a designed mix"],
  },
  {
    id: "brick",
    name: "Brick Estimator",
    tag: "Masonry",
    group: "Construction & materials",
    desc: "Bricks & mortar for any wall size.",
    icon: Grid3x3,
    accent: "#B0623A",
    Component: BrickEstimator,
    about:
      "Wall volume (length × height × thickness) ÷ modular brick volume, taking ~500 bricks per m³ including 10 mm mortar joints.",
    assumptions: ["Standard modular bricks", "Mortar ≈ 30% of wall volume", "Excludes door/window openings"],
  },
  {
    id: "beam",
    name: "Beam Load",
    tag: "Structural",
    group: "Construction & materials",
    desc: "Max load for a simply-supported RCC beam.",
    icon: Sigma,
    accent: "#9A8455",
    Component: BeamLoad,
    about:
      "Limit-state balanced section: moment capacity Mu = 0.138·fck·b·d²; safe uniform load w = 8·Mu/L² for a simply-supported span.",
    assumptions: ["Simply-supported, singly-reinforced beam", "Balanced section, Fe415 steel", "Indicative only — not a structural design"],
  },
  {
    id: "emi",
    name: "EMI / Home Loan",
    tag: "Finance",
    group: "Finance",
    desc: "Monthly installment from amount, rate & tenure.",
    icon: Banknote,
    accent: "#B05B33",
    Component: EmiCalculator,
    about:
      "Standard reducing-balance EMI formula: EMI = P·i·(1+i)ⁿ / ((1+i)ⁿ − 1), where i is the monthly rate and n the number of months.",
    assumptions: ["Fixed interest rate for the full tenure", "Monthly compounding", "Excludes processing fees & insurance"],
  },
  {
    id: "area",
    name: "Area Converter",
    tag: "Utility",
    group: "Conversion",
    desc: "Ropani · Aana · Bigha · Kattha ↔ sq.ft / sq.m.",
    icon: Ruler,
    accent: "#157A74",
    Component: AreaConverter,
    about:
      "Converts using fixed Nepali land-unit equivalents — 1 Ropani = 16 Aana = 5,476 sq.ft (hills); 1 Bigha = 20 Kattha = 72,900 sq.ft (Terai).",
    assumptions: ["Hill units: Ropani–Aana–Paisa–Daam", "Terai units: Bigha–Kattha–Dhur", "Standard survey conversions"],
  },
  {
    id: "ai",
    name: "AI Advisor",
    tag: "New",
    group: "Assistant",
    desc: "Ask anything about NBC, materials, costs.",
    icon: Sparkles,
    accent: "#6B8E5A",
    Component: ComingSoon,
    about: "",
    assumptions: [],
    comingSoon: true,
  },
];

const GROUPS = ["Construction & materials", "Finance", "Conversion", "Assistant"];

const HERO_CHIPS = [
  { icon: Zap, label: "Instant results" },
  { icon: MapPin, label: "Nepal-tuned formulas" },
  { icon: ShieldCheck, label: "Free to use" },
];

function InfoBlocks({ about, assumptions }: { about: string; assumptions: string[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-2xl border border-[#E8DECF] bg-[#FBF7EF]/60 p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/60">
          <Info className="h-3.5 w-3.5" /> How it&apos;s calculated
        </p>
        <p className="text-[13px] leading-relaxed text-[#5C4D3C]/80">{about}</p>
      </div>
      <div className="rounded-2xl border border-[#E8DECF] bg-[#FBF7EF]/60 p-4">
        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/60">
          <ListChecks className="h-3.5 w-3.5" /> Assumptions
        </p>
        <ul className="space-y-1.5">
          {assumptions.map((a) => (
            <li key={a} className="flex gap-2 text-[13px] leading-snug text-[#5C4D3C]/80">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#5C4D3C]/40" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function CalculatorsPage() {
  const [activeId, setActiveId] = useState(CALCS[0].id);
  const active = CALCS.find((c) => c.id === activeId) ?? CALCS[0];
  const ActiveComp = active.Component;
  const related = CALCS.filter((c) => c.group === active.group && c.id !== active.id);

  return (
    <div className="relative flex min-h-screen flex-col font-sans selection:bg-ember/20 selection:text-ember">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {/* Breadcrumb */}
        <nav className="mb-4 flex items-center gap-1.5 text-[11px] font-semibold text-[#5C4D3C]/60">
          <Link href="/" className="transition-colors hover:text-[#342417]">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-[#342417]">Calculators</span>
        </nav>

        {/* Hero */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-[#E8DECF] bg-gradient-to-br from-[#FBF7EF] via-white to-[#F6EFE0] p-6 sm:p-8">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[#B0892E]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B0892E]">Tools</span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-extrabold tracking-tight text-[#342417] sm:text-4xl">
            Pick what you need
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[#5C4D3C]/75 sm:text-base">
            Free construction & finance calculators, built for Nepal — estimate materials, costs, loans and land
            measurements in seconds.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {HERO_CHIPS.map((chip) => {
              const Icon = chip.icon;
              return (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D4C5] bg-white/70 px-3 py-1.5 text-[11px] font-bold text-[#5C4D3C]"
                >
                  <Icon className="h-3.5 w-3.5 text-[#B0892E]" />
                  {chip.label}
                </span>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[320px_1fr] lg:gap-8">
          {/* Grouped selector (sticky on desktop) */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="flex flex-col gap-5">
              {GROUPS.map((group) => (
                <div key={group}>
                  <p className="mb-2 px-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#5C4D3C]/45">
                    {group}
                  </p>
                  <div className="flex flex-col gap-2">
                    {CALCS.filter((c) => c.group === group).map((c) => {
                      const Icon = c.icon;
                      const isActive = c.id === activeId;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveId(c.id)}
                          aria-pressed={isActive}
                          className={`group flex items-center gap-3 rounded-2xl border bg-white px-3.5 py-3 text-left transition-all duration-200 cursor-pointer ${
                            isActive
                              ? "border-[#E0B23C] shadow-[0_10px_28px_-14px_rgba(176,137,46,0.55)] ring-1 ring-[#E0B23C]/40"
                              : "border-[#E8DECF] hover:-translate-y-0.5 hover:shadow-md"
                          }`}
                        >
                          <span
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                            style={{ backgroundColor: `${c.accent}1a`, color: c.accent }}
                          >
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-center gap-2">
                              <span className="truncate text-sm font-extrabold text-[#342417]">{c.name}</span>
                              {c.tag === "Most used" && <span className="h-1.5 w-1.5 rounded-full bg-[#E0B23C]" />}
                            </span>
                            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-[#5C4D3C]/45">
                              {c.tag}
                            </span>
                          </span>
                          <ChevronRight
                            className={`h-4 w-4 shrink-0 transition ${
                              isActive ? "text-[#B0892E]" : "text-[#5C4D3C]/30 group-hover:translate-x-0.5"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Active calculator */}
          <section className="min-w-0">
            <div className="overflow-hidden rounded-3xl border border-[#E8DECF] bg-white shadow-sm">
              {/* Header band tinted with the tool's accent */}
              <div
                className="flex items-center gap-3.5 border-b border-[#EFE7D8] px-5 py-5 sm:px-7"
                style={{ background: `linear-gradient(110deg, ${active.accent}14, transparent 70%)` }}
              >
                <span
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${active.accent}1f`, color: active.accent }}
                >
                  <active.icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold text-[#342417] sm:text-xl">{active.name}</h2>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide"
                      style={{ backgroundColor: `${active.accent}1a`, color: active.accent }}
                    >
                      {active.tag}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[#5C4D3C]/70 sm:text-sm">{active.desc}</p>
                </div>
              </div>

              <div className="p-5 sm:p-7">
                <ActiveComp accent={active.accent} />

                {!active.comingSoon && <InfoBlocks about={active.about} assumptions={active.assumptions} />}

                {/* Related tools */}
                {related.length > 0 && (
                  <div className="mt-6 border-t border-[#EFE7D8] pt-5">
                    <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/45">
                      Related tools
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {related.map((r) => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setActiveId(r.id)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#E0D4C5] bg-[#FBF7EF] px-3 py-1.5 text-xs font-bold text-[#342417] transition hover:-translate-y-0.5 hover:border-[#342417]/20 hover:bg-white cursor-pointer"
                          >
                            <Icon className="h-3.5 w-3.5" style={{ color: r.accent }} />
                            {r.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!active.comingSoon && (
              <p className="mt-4 px-1 text-[11px] leading-relaxed text-[#5C4D3C]/50">
                Estimates use standard thumb rules and may vary by site, design, soil and current market rates. Always
                confirm critical quantities with a qualified engineer.
              </p>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
