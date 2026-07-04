import Link from "next/link";
import {
  MapPin, BadgeCheck, Briefcase, Phone, Mail, ArrowLeft, Clock, Languages as LangIcon,
  Globe, Link2, AtSign, MessageCircle, Play, Music2, Check,
} from "lucide-react";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { PORTFOLIO_SCHEMAS } from "@/lib/portfolio-schemas";
import type { PublicPortfolio, PortfolioSocials } from "@/lib/portfolio-api";
import { CATEGORY_ICON, FALLBACK_ICON } from "./categoryMeta";

const SOCIAL_META: Record<keyof PortfolioSocials, { label: string; icon: typeof Globe }> = {
  website: { label: "Website", icon: Globe },
  facebook: { label: "Facebook", icon: Link2 },
  instagram: { label: "Instagram", icon: AtSign },
  linkedin: { label: "LinkedIn", icon: Link2 },
  youtube: { label: "YouTube", icon: Play },
  tiktok: { label: "TikTok", icon: Music2 },
  viber: { label: "Viber", icon: MessageCircle },
  whatsapp: { label: "WhatsApp", icon: MessageCircle },
  behance: { label: "Behance", icon: Link2 },
};

function socialHref(key: keyof PortfolioSocials, value: string): string {
  if (key === "whatsapp") return `https://wa.me/${value.replace(/[^\d]/g, "")}`;
  if (key === "viber") return `viber://chat?number=${value.replace(/[^\d+]/g, "")}`;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function displayDetail(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  return String(value);
}

export function ProfessionalProfile({ pro }: { pro: PublicPortfolio }) {
  const Icon = CATEGORY_ICON[pro.category] ?? FALLBACK_ICON;
  const initials = pro.owner.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  // Category-specific fields in schema order, only those with a value.
  const detailRows = PORTFOLIO_SCHEMAS[pro.category]
    .flatMap((s) => s.fields)
    .map((f) => ({ label: f.label, value: displayDetail(pro.details[f.key]) }))
    .filter((r): r is { label: string; value: string } => r.value !== null);

  const socials = (Object.keys(SOCIAL_META) as (keyof PortfolioSocials)[])
    .map((k) => ({ key: k, value: pro.socials?.[k]?.trim() }))
    .filter((s): s is { key: keyof PortfolioSocials; value: string } => !!s.value);

  const feeText = [pro.feeModel, pro.feeAmount != null ? `NPR ${pro.feeAmount.toLocaleString()}` : ""]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="min-h-screen bg-sand/30">
      <Navbar />

      {/* Cover banner */}
      <div className="relative h-40 w-full overflow-hidden bg-gradient-to-r from-[#2E2116] to-[#5C4130] sm:h-52">
        {pro.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pro.coverImage.url} alt="" className="h-full w-full object-cover opacity-70" />
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link href="/professionals" className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#8A7A67] hover:text-[#5C4D3C]">
          <ArrowLeft className="h-4 w-4" /> All professionals
        </Link>

        {/* Header card */}
        <div className="-mt-2 rounded-2xl border border-mist bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="relative -mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-[#F1E9DD] shadow-md">
              {pro.owner.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pro.owner.avatar} alt={pro.owner.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-2xl font-black text-[#B05B33]">
                  {initials || "N"}
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-[#342417]">{pro.owner.name}</h1>
                {pro.owner.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#157A74]/10 px-2 py-0.5 text-[11px] font-bold text-[#157A74]">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
              </div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-[#B05B33]">
                <Icon className="h-4 w-4" /> {pro.categoryLabel}
              </div>
              {pro.headline && <p className="mt-2 text-[15px] leading-relaxed text-[#5C4D3C]">{pro.headline}</p>}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-[#8A7A67]">
                {pro.owner.location && <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4" /> {pro.owner.location}</span>}
                {pro.experienceYears != null && <span className="inline-flex items-center gap-1"><Briefcase className="h-4 w-4" /> {pro.experienceYears} yrs experience</span>}
                {pro.availability && <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {pro.availability}</span>}
              </div>
            </div>
          </div>

          {/* Contact actions */}
          <div className="mt-5 flex flex-wrap gap-2.5 border-t border-[#F0EAE0] pt-4">
            {pro.owner.contact && (
              <a href={`tel:${pro.owner.contact}`} className="inline-flex items-center gap-2 rounded-xl bg-[#B05B33] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#9a4c28]">
                <Phone className="h-4 w-4" /> Call
              </a>
            )}
            {pro.owner.email && (
              <a href={`mailto:${pro.owner.email}`} className="inline-flex items-center gap-2 rounded-xl border border-[#E4DCD0] bg-white px-4 py-2.5 text-[13px] font-bold text-[#5C4D3C] transition hover:border-[#C9B79F]">
                <Mail className="h-4 w-4" /> Email
              </a>
            )}
          </div>
        </div>

        {/* Body: main + sidebar */}
        <div className="mt-5 grid grid-cols-1 gap-5 pb-14 lg:grid-cols-3">
          <div className="space-y-5 lg:col-span-2">
            {pro.bio && (
              <section className="rounded-2xl border border-mist bg-white p-5 sm:p-6">
                <h2 className="mb-2 text-sm font-bold text-[#342417]">About</h2>
                <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#5C4D3C]">{pro.bio}</p>
              </section>
            )}

            {detailRows.length > 0 && (
              <section className="rounded-2xl border border-mist bg-white p-5 sm:p-6">
                <h2 className="mb-3 text-sm font-bold text-[#342417]">Expertise &amp; credentials</h2>
                <dl className="divide-y divide-[#F0EAE0]">
                  {detailRows.map((r) => (
                    <div key={r.label} className="flex gap-3 py-2.5 text-[13px]">
                      <dt className="w-44 shrink-0 font-semibold text-[#8A7A67]">{r.label}</dt>
                      <dd className="text-[#342417]">{r.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {pro.projects.length > 0 && (
              <section className="rounded-2xl border border-mist bg-white p-5 sm:p-6">
                <h2 className="mb-4 text-sm font-bold text-[#342417]">Work &amp; projects</h2>
                <div className="space-y-6">
                  {pro.projects.map((p) => (
                    <article key={p.localId} className="border-b border-[#F0EAE0] pb-6 last:border-b-0 last:pb-0">
                      {p.images.length > 0 && (
                        <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                          {p.images.map((img, i) => (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img key={i} src={img.url} alt={p.title || `Project ${i + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover" />
                          ))}
                        </div>
                      )}
                      {p.title && <h3 className="text-[14px] font-bold text-[#342417]">{p.title}</h3>}
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#8A7A67]">
                        {p.type && <span>{p.type}</span>}
                        {p.district && <span>· {p.district}</span>}
                        {p.year && <span>· {p.year}</span>}
                        {p.valueRange && <span>· NPR {p.valueRange}</span>}
                      </div>
                      {p.description && <p className="mt-2 text-[13px] leading-relaxed text-[#5C4D3C]">{p.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            <section className="rounded-2xl border border-mist bg-white p-5">
              <h2 className="mb-3 text-sm font-bold text-[#342417]">Quick facts</h2>
              <dl className="space-y-2.5 text-[13px]">
                {pro.preferredContact && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#8A7A67]">Preferred contact</dt>
                    <dd className="font-semibold text-[#342417]">{pro.preferredContact}</dd>
                  </div>
                )}
                {feeText && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#8A7A67]">Fee</dt>
                    <dd className="text-right font-semibold text-[#342417]">{feeText}</dd>
                  </div>
                )}
                {pro.referenceId && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-[#8A7A67]">Ref</dt>
                    <dd className="font-mono text-[12px] font-semibold text-[#342417]">{pro.referenceId}</dd>
                  </div>
                )}
              </dl>
            </section>

            {pro.serviceAreas.length > 0 && (
              <section className="rounded-2xl border border-mist bg-white p-5">
                <h2 className="mb-3 text-sm font-bold text-[#342417]">Service areas</h2>
                <div className="flex flex-wrap gap-1.5">
                  {pro.serviceAreas.map((a) => (
                    <span key={a} className="rounded-full bg-[#F5F1EA] px-2.5 py-1 text-[12px] font-semibold text-[#5C4D3C]">{a}</span>
                  ))}
                </div>
              </section>
            )}

            {pro.languages.length > 0 && (
              <section className="rounded-2xl border border-mist bg-white p-5">
                <h2 className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-[#342417]">
                  <LangIcon className="h-4 w-4 text-[#8A7A67]" /> Languages
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {pro.languages.map((l) => (
                    <span key={l} className="inline-flex items-center gap-1 rounded-full bg-[#F5F1EA] px-2.5 py-1 text-[12px] font-semibold text-[#5C4D3C]">
                      <Check className="h-3 w-3 text-[#157A74]" /> {l}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {socials.length > 0 && (
              <section className="rounded-2xl border border-mist bg-white p-5">
                <h2 className="mb-3 text-sm font-bold text-[#342417]">Links</h2>
                <div className="flex flex-col gap-2">
                  {socials.map(({ key, value }) => {
                    const meta = SOCIAL_META[key];
                    const SIcon = meta.icon;
                    return (
                      <a key={key} href={socialHref(key, value)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5C4D3C] transition hover:text-[#B05B33]">
                        <SIcon className="h-4 w-4 text-[#8A7A67]" /> {meta.label}
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
