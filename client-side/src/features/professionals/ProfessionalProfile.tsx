import Link from "next/link";
import {
  MapPin, BadgeCheck, Briefcase, Phone, Mail, ArrowLeft, Clock, Images, Languages as LangIcon,
  Globe, Link2, AtSign, MessageCircle, Play, Music2, Check, ShieldCheck, Wallet, Sparkles,
} from "lucide-react";
import { Navbar } from "@/features/landing/components/Navbar";
import { Footer } from "@/features/landing/components/Footer";
import { PORTFOLIO_SCHEMAS } from "@/lib/portfolio-schemas";
import type { PublicPortfolio, PortfolioSocials } from "@/lib/portfolio-api";
import { CATEGORY_ICON, FALLBACK_ICON } from "./categoryMeta";

const ACCENT = "#B05B33";

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

// Small stat tile shown in the overlapping strip.
function Stat({ icon: Icon, value, label }: { icon: typeof Briefcase; value: string | number; label: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-lg font-extrabold leading-none text-[#342417]">{value}</p>
        <p className="mt-1 truncate text-[11px] font-semibold uppercase tracking-wide text-[#5C4D3C]/55">{label}</p>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center gap-2.5">
      <span className="h-4 w-1 rounded-full" style={{ backgroundColor: ACCENT }} />
      <h2 className="text-lg font-extrabold tracking-tight text-[#342417]">{children}</h2>
    </div>
  );
}

export function ProfessionalProfile({ pro }: { pro: PublicPortfolio }) {
  const Icon = CATEGORY_ICON[pro.category] ?? FALLBACK_ICON;
  const initials = pro.owner.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const fields = PORTFOLIO_SCHEMAS[pro.category].flatMap((s) => s.fields);
  // Split the details bag: scalar "credentials" vs list-type "skills".
  const credentials = fields
    .filter((f) => f.type !== "chip-multiselect")
    .map((f) => ({ label: f.label, value: pro.details[f.key] }))
    .filter((r) => r.value !== undefined && r.value !== null && r.value !== "")
    .map((r) => ({ label: r.label, value: typeof r.value === "boolean" ? (r.value ? "Yes" : "No") : String(r.value) }));
  const skillGroups = fields
    .filter((f) => f.type === "chip-multiselect" && Array.isArray(pro.details[f.key]) && (pro.details[f.key] as unknown[]).length > 0)
    .map((f) => ({ label: f.label, items: (pro.details[f.key] as string[]) }));

  const socials = (Object.keys(SOCIAL_META) as (keyof PortfolioSocials)[])
    .map((k) => ({ key: k, value: pro.socials?.[k]?.trim() }))
    .filter((s): s is { key: keyof PortfolioSocials; value: string } => !!s.value);

  const feeText = [pro.feeModel, pro.feeAmount != null ? `NPR ${pro.feeAmount.toLocaleString()}` : ""].filter(Boolean).join(" · ");
  const whatsapp = pro.socials?.whatsapp?.trim();

  return (
    <div className="min-h-screen bg-[#F7F3EC]">
      <Navbar />

      {/* ── Cinematic hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#211507] via-[#2E2116] to-[#3a2917]" />
        {pro.coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={pro.coverImage.url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        )}
        <div className="absolute inset-0" style={{ background: `radial-gradient(90% 90% at 12% 0%, ${ACCENT}66, transparent 55%)` }} />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F7F3EC] via-[#F7F3EC]/0 to-transparent" />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6 sm:pb-28">
          <Link href="/professionals" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/60 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" /> All professionals
          </Link>

          <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <div className="h-28 w-28 shrink-0 overflow-hidden rounded-3xl bg-white/10 shadow-2xl ring-1 ring-white/15 backdrop-blur sm:h-32 sm:w-32">
              {pro.owner.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pro.owner.avatar} alt={pro.owner.name} className="h-full w-full object-cover" />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-3xl font-black text-white/90">{initials || "N"}</span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#F2D9A8] ring-1 ring-white/10">
                  <Icon className="h-3.5 w-3.5" /> {pro.categoryLabel}
                </span>
                {pro.owner.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#157A74]/25 px-2.5 py-1 text-[11px] font-bold text-emerald-200 ring-1 ring-emerald-300/20">
                    <BadgeCheck className="h-3.5 w-3.5" /> Verified
                  </span>
                )}
                {pro.availability && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white/80 ring-1 ring-white/10">
                    <span className={`h-1.5 w-1.5 rounded-full ${pro.availability === "Available" ? "bg-emerald-400" : "bg-amber-400"}`} />
                    {pro.availability}
                  </span>
                )}
              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{pro.owner.name}</h1>
              {pro.headline && <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-white/70 sm:text-base">{pro.headline}</p>}

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/55">
                {pro.owner.location && <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {pro.owner.location}</span>}
                {pro.experienceYears != null && <span className="inline-flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {pro.experienceYears} yrs experience</span>}
              </div>

              {/* CTAs */}
              <div className="mt-6 flex flex-wrap gap-2.5">
                {pro.owner.contact && (
                  <a href={`tel:${pro.owner.contact}`} className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:brightness-110" style={{ backgroundColor: ACCENT }}>
                    <Phone className="h-4 w-4" /> Call now
                  </a>
                )}
                {whatsapp && (
                  <a href={socialHref("whatsapp", whatsapp)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-[#25623b] px-5 py-2.5 text-[13px] font-bold text-white shadow-lg transition hover:brightness-110">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                )}
                {pro.owner.email && (
                  <a href={`mailto:${pro.owner.email}`} className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-2.5 text-[13px] font-bold text-white backdrop-blur transition hover:bg-white/20">
                    <Mail className="h-4 w-4" /> Email
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Overlapping stat strip ── */}
      <div className="relative z-20 mx-auto -mt-14 max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-2 divide-x divide-y divide-mist/70 overflow-hidden rounded-2xl border border-mist bg-white shadow-[0_20px_50px_-24px_rgba(52,36,23,0.5)] sm:grid-cols-4 sm:divide-y-0">
          <Stat icon={Briefcase} value={pro.experienceYears ?? "—"} label="Years exp." />
          <Stat icon={Images} value={pro.projects.length} label="Projects" />
          <Stat icon={MapPin} value={pro.serviceAreas.length} label="Service areas" />
          <Stat icon={LangIcon} value={pro.languages.length} label="Languages" />
        </div>
      </div>

      {/* ── Body ── */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main column */}
          <div className="space-y-8 lg:col-span-2">
            {pro.bio && (
              <section className="rounded-3xl border border-mist bg-white p-6 shadow-[0_1px_2px_rgba(46,33,22,0.04)] sm:p-8">
                <SectionTitle>About</SectionTitle>
                <p className="whitespace-pre-line text-[15px] leading-[1.8] text-[#5C4D3C]">{pro.bio}</p>
              </section>
            )}

            {(credentials.length > 0 || skillGroups.length > 0) && (
              <section className="rounded-3xl border border-mist bg-white p-6 shadow-[0_1px_2px_rgba(46,33,22,0.04)] sm:p-8">
                <SectionTitle>Expertise &amp; credentials</SectionTitle>

                {credentials.length > 0 && (
                  <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {credentials.map((c) => (
                      <div key={c.label} className="rounded-2xl border border-mist bg-sand/30 px-4 py-3">
                        <p className="text-[11px] font-bold uppercase tracking-wide text-[#5C4D3C]/55">{c.label}</p>
                        <p className="mt-1 text-sm font-bold text-[#342417]">{c.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {skillGroups.map((g) => (
                  <div key={g.label} className="mt-5 first:mt-0">
                    <p className="mb-2.5 text-[12px] font-extrabold uppercase tracking-wide text-[#342417]/60">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((it) => (
                        <span key={it} className="inline-flex items-center gap-1.5 rounded-lg bg-[#B05B33]/[0.07] px-3 py-1.5 text-[12.5px] font-semibold text-[#342417]">
                          <Check className="h-3.5 w-3.5" style={{ color: ACCENT }} /> {it}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </section>
            )}

            {pro.projects.length > 0 && (
              <section className="rounded-3xl border border-mist bg-white p-6 shadow-[0_1px_2px_rgba(46,33,22,0.04)] sm:p-8">
                <SectionTitle>Selected work</SectionTitle>
                <div className="space-y-8">
                  {pro.projects.map((p) => (
                    <article key={p.localId} className="group">
                      {p.images.length > 0 && (
                        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {p.images.map((img, j) => (
                            <div key={j} className="overflow-hidden rounded-2xl">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img.url} alt={p.title || `Project image ${j + 1}`} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                            </div>
                          ))}
                        </div>
                      )}
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        {p.title && <h3 className="text-base font-extrabold text-[#342417]">{p.title}</h3>}
                        {p.valueRange && <span className="text-[12px] font-bold text-[#5C4D3C]/60">NPR {p.valueRange}</span>}
                      </div>
                      <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] font-medium text-[#5C4D3C]/60">
                        {p.type && <span>{p.type}</span>}
                        {p.district && <span>· {p.district}</span>}
                        {p.year && <span>· {p.year}</span>}
                        {p.role && <span>· {p.role}</span>}
                      </div>
                      {p.description && <p className="mt-2 text-[13.5px] leading-relaxed text-[#5C4D3C]">{p.description}</p>}
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sticky sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden rounded-3xl border border-mist bg-white shadow-[0_18px_50px_-28px_rgba(52,36,23,0.45)]">
              {/* Header */}
              <div className="relative px-6 py-6 text-white" style={{ background: `linear-gradient(135deg, #2E2116, ${ACCENT})` }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/70">Get in touch</p>
                <p className="mt-1 text-lg font-extrabold">{pro.owner.name}</p>
                {pro.preferredContact && <p className="mt-0.5 text-[12px] text-white/70">Prefers {pro.preferredContact}</p>}
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-col gap-2.5">
                  {pro.owner.contact && (
                    <a href={`tel:${pro.owner.contact}`} className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition hover:brightness-110" style={{ backgroundColor: ACCENT }}>
                      <Phone className="h-4 w-4" /> {pro.owner.contact}
                    </a>
                  )}
                  {pro.owner.email && (
                    <a href={`mailto:${pro.owner.email}`} className="inline-flex items-center justify-center gap-2 rounded-xl border border-mist bg-white px-4 py-2.5 text-[13px] font-bold text-[#342417] transition hover:border-[#C9B79F]">
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  )}
                </div>

                {(feeText || pro.owner.location) && (
                  <dl className="space-y-2.5 border-t border-mist pt-4 text-[13px]">
                    {pro.owner.location && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><MapPin className="h-3.5 w-3.5" /> Based in</dt>
                        <dd className="text-right font-semibold text-[#342417]">{pro.owner.location}</dd>
                      </div>
                    )}
                    {feeText && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Wallet className="h-3.5 w-3.5" /> Fee</dt>
                        <dd className="text-right font-semibold text-[#342417]">{feeText}</dd>
                      </div>
                    )}
                    {pro.availability && (
                      <div className="flex items-center justify-between gap-3">
                        <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Clock className="h-3.5 w-3.5" /> Availability</dt>
                        <dd className="text-right font-semibold text-[#342417]">{pro.availability}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {pro.serviceAreas.length > 0 && (
                  <div className="border-t border-mist pt-4">
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-[#5C4D3C]/55">Service areas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pro.serviceAreas.map((a) => (
                        <span key={a} className="rounded-full bg-sand/60 px-2.5 py-1 text-[11.5px] font-semibold text-[#5C4D3C]">{a}</span>
                      ))}
                    </div>
                  </div>
                )}

                {pro.languages.length > 0 && (
                  <div className="border-t border-mist pt-4">
                    <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wide text-[#5C4D3C]/55">Languages</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pro.languages.map((l) => (
                        <span key={l} className="rounded-full bg-sand/60 px-2.5 py-1 text-[11.5px] font-semibold text-[#5C4D3C]">{l}</span>
                      ))}
                    </div>
                  </div>
                )}

                {socials.length > 0 && (
                  <div className="flex flex-wrap gap-2 border-t border-mist pt-4">
                    {socials.map(({ key, value }) => {
                      const SIcon = SOCIAL_META[key].icon;
                      return (
                        <a key={key} href={socialHref(key, value)} target="_blank" rel="noopener noreferrer" aria-label={SOCIAL_META[key].label}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-mist bg-white text-[#5C4D3C] transition hover:border-[#B05B33]/40 hover:text-[#B05B33]">
                          <SIcon className="h-4 w-4" />
                        </a>
                      );
                    })}
                  </div>
                )}

                {pro.owner.verified && (
                  <div className="flex items-center gap-2 rounded-xl bg-[#157A74]/[0.07] px-3 py-2.5 text-[12px] font-semibold text-[#157A74]">
                    <ShieldCheck className="h-4 w-4" /> Identity verified by NirMix
                  </div>
                )}
                {pro.referenceId && (
                  <p className="flex items-center justify-center gap-1.5 text-[11px] font-medium text-[#5C4D3C]/45">
                    <Sparkles className="h-3 w-3" /> {pro.referenceId}
                  </p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
