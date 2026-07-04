"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Camera, Trash2, Loader2, Mail, Phone, BadgeCheck, Pencil, Eye, Plus,
  Briefcase, KeyRound, Clock, Wallet, Languages as LangIcon, ArrowRight,
  Globe, Link2, AtSign, MessageCircle, Play, Music2, ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import {
  fetchMyPortfolio, deletePortfolio, type ApiPortfolio, type PortfolioSocials,
} from "@/lib/portfolio-api";
import { CATEGORY_LABELS, PORTFOLIO_SCHEMAS } from "@/lib/portfolio-schemas";

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

function displayDetail(value: unknown): string | null {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.length ? value.join(", ") : null;
  return String(value);
}

function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-mist bg-white p-5 shadow-[0_1px_2px_rgba(46,33,22,0.04)] sm:p-6">
      {title && (
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-[#342417]/70">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, accessToken } = useAuth();

  const [portfolio, setPortfolio] = useState<ApiPortfolio | null>(null);
  const [loadingPf, setLoadingPf] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    fetchMyPortfolio()
      .then((data) => { if (active) setPortfolio(data); })
      .catch(() => { /* leave null → shows create CTA */ })
      .finally(() => { if (active) setLoadingPf(false); });
    return () => { active = false; };
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!accessToken) return toast.error("Please log in to update your photo.");
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await apiFetch("http://localhost:5001/api/users/me/avatar", { method: "PATCH", body: fd });
      const json = await res.json();
      if (!res.ok) return toast.error(json.message || "Failed to update photo.");
      updateUser({ avatar: json.data.avatar });
      toast.success("Profile picture updated.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user?.avatar || !accessToken) return;
    setRemovingAvatar(true);
    try {
      const res = await apiFetch("http://localhost:5001/api/users/me/avatar", { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) return toast.error(json.message || "Failed to remove photo.");
      updateUser({ avatar: "" });
      toast.success("Profile picture removed.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setRemovingAvatar(false);
    }
  };

  const handleDeletePortfolio = async () => {
    if (!portfolio) return;
    setDeleting(true);
    try {
      await deletePortfolio(portfolio._id);
      setPortfolio(null);
      setConfirmDelete(false);
      toast.success("Portfolio deleted.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete portfolio.");
    } finally {
      setDeleting(false);
    }
  };

  const name = user?.name ?? "Your name";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase() || "U";

  const detailRows = portfolio
    ? PORTFOLIO_SCHEMAS[portfolio.category]
        .flatMap((s) => s.fields)
        .map((f) => ({ label: f.label, value: displayDetail(portfolio.details?.[f.key]) }))
        .filter((r): r is { label: string; value: string } => r.value !== null)
    : [];

  const socials = portfolio
    ? (Object.keys(SOCIAL_META) as (keyof PortfolioSocials)[])
        .map((k) => ({ key: k, value: portfolio.socials?.[k]?.trim() }))
        .filter((s): s is { key: keyof PortfolioSocials; value: string } => !!s.value)
    : [];

  const feeText = portfolio
    ? [portfolio.feeModel, portfolio.feeAmount != null ? `NPR ${portfolio.feeAmount.toLocaleString()}` : ""].filter(Boolean).join(" · ")
    : "";

  // Profile completeness (real signals from the portfolio + account).
  const completeness = (() => {
    const checks = [
      !!user?.avatar,
      !!portfolio,
      !!portfolio?.bio,
      (portfolio?.projects?.length ?? 0) > 0,
      (portfolio?.serviceAreas?.length ?? 0) > 0,
      (portfolio?.languages?.length ?? 0) > 0,
      socials.length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  })();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      {/* ── Header card ── */}
      <div className="overflow-hidden rounded-3xl border border-mist bg-white shadow-[0_24px_60px_-30px_rgba(52,36,23,0.5)]">
        <div className="relative h-40 sm:h-48">
          <div className="absolute inset-0 bg-gradient-to-br from-[#211507] via-[#2E2116] to-[#3a2917]" />
          {portfolio?.coverImage?.url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={portfolio.coverImage.url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          )}
          <div className="absolute inset-0" style={{ background: `radial-gradient(90% 100% at 88% 0%, ${ACCENT}66, transparent 55%)` }} />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/95 to-transparent" />
        </div>

        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              {/* Avatar with always-available upload/remove */}
              <div className="group relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#342417] text-2xl font-extrabold text-white shadow-lg sm:h-28 sm:w-28">
                  {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <input ref={avatarInputRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  aria-label="Change photo"
                  className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                  style={{ backgroundColor: ACCENT }}
                >
                  {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                </button>
                {user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={removingAvatar}
                    aria-label="Remove photo"
                    className="absolute -top-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white opacity-0 shadow-md transition hover:bg-red-600 group-hover:opacity-100 disabled:opacity-60"
                  >
                    {removingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                )}
              </div>

              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-extrabold tracking-tight text-[#342417]">{name}</h1>
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#157A74]/10 px-2 py-0.5 text-[11px] font-bold text-[#157A74]">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
                {portfolio ? (
                  <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: ACCENT }}>
                    <Briefcase className="h-4 w-4" /> {CATEGORY_LABELS[portfolio.category]}
                    {portfolio.availability && (
                      <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-sand/70 px-2 py-0.5 text-[11px] font-bold text-[#5C4D3C]">
                        <span className={`h-1.5 w-1.5 rounded-full ${portfolio.availability === "Available" ? "bg-emerald-500" : "bg-[#C9A24B]"}`} />
                        {portfolio.availability}
                      </span>
                    )}
                  </p>
                ) : (
                  <p className="mt-0.5 text-sm text-[#5C4D3C]/70">Personal account</p>
                )}
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-[#5C4D3C]/75">
                  {user?.email && <span className="inline-flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {user.email}</span>}
                  {user?.contact && <span className="inline-flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {user.contact}</span>}
                </div>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-wrap gap-2.5 pb-1">
              {portfolio ? (
                <>
                  <Link href={`/professionals/${portfolio._id}`} className="inline-flex items-center gap-1.5 rounded-xl border border-mist bg-white px-4 py-2.5 text-[13px] font-bold text-[#342417] transition hover:border-[#C9B79F]">
                    <Eye className="h-4 w-4" /> View public
                  </Link>
                  <button onClick={() => router.push("/dashboard/create-portfolio")} className="inline-flex items-center gap-1.5 rounded-xl bg-[#B05B33] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#9a4c28]">
                    <Pencil className="h-4 w-4" /> Edit portfolio
                  </button>
                </>
              ) : (
                <Link href="/dashboard/create-portfolio" className="inline-flex items-center gap-1.5 rounded-xl bg-[#B05B33] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#9a4c28]">
                  <Plus className="h-4 w-4" /> Create portfolio
                </Link>
              )}
            </div>
          </div>

          {portfolio?.headline && (
            <p className="mt-4 max-w-2xl border-t border-mist pt-4 text-[15px] leading-relaxed text-[#5C4D3C]">
              {portfolio.headline}
            </p>
          )}
        </div>
      </div>

      {/* ── Body ── */}
      {loadingPf ? (
        <div className="mt-6 flex items-center justify-center rounded-2xl border border-mist bg-white py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#B05B33]" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Main */}
          <div className="space-y-5 lg:col-span-2">
            {portfolio ? (
              <>
                {portfolio.bio && (
                  <Card title="About">
                    <p className="whitespace-pre-line text-[14px] leading-relaxed text-[#5C4D3C]">{portfolio.bio}</p>
                  </Card>
                )}

                {detailRows.length > 0 && (
                  <Card title="Expertise & credentials">
                    <dl className="divide-y divide-mist/70">
                      {detailRows.map((r) => (
                        <div key={r.label} className="flex gap-3 py-2.5 text-[13px]">
                          <dt className="w-44 shrink-0 font-semibold text-[#5C4D3C]/70">{r.label}</dt>
                          <dd className="text-[#342417]">{r.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </Card>
                )}

                {(portfolio.projects?.length ?? 0) > 0 && (
                  <Card title="Work & projects">
                    <div className="space-y-6">
                      {portfolio.projects!.map((p, i) => (
                        <article key={i} className="border-b border-mist/70 pb-6 last:border-b-0 last:pb-0">
                          {p.images.length > 0 && (
                            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                              {p.images.map((img, j) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img key={j} src={img.url} alt={p.title || `Project ${i + 1}`} className="aspect-[4/3] w-full rounded-xl object-cover" />
                              ))}
                            </div>
                          )}
                          {p.title && <h3 className="text-[14px] font-bold text-[#342417]">{p.title}</h3>}
                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[12px] text-[#5C4D3C]/70">
                            {p.type && <span>{p.type}</span>}
                            {p.district && <span>· {p.district}</span>}
                            {p.year && <span>· {p.year}</span>}
                          </div>
                          {p.description && <p className="mt-2 text-[13px] leading-relaxed text-[#5C4D3C]">{p.description}</p>}
                        </article>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              // No portfolio yet
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-mist bg-white/70 px-6 py-14 text-center">
                <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ backgroundColor: `${ACCENT}1a`, color: ACCENT }}>
                  <Briefcase className="h-7 w-7" />
                </span>
                <h3 className="text-lg font-extrabold text-[#342417]">Create your professional portfolio</h3>
                <p className="mt-1.5 max-w-sm text-sm text-[#5C4D3C]/70">
                  Are you an engineer, architect, agent, interior designer or contractor? Publish a profile and get discovered by clients across Nepal.
                </p>
                <Link href="/dashboard/create-portfolio" className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#B05B33] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#9a4c28]">
                  Get started <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-5">
            {/* Completeness */}
            <Card>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-extrabold uppercase tracking-wide text-[#5C4D3C]/60">Profile strength</span>
                <span className="text-sm font-black" style={{ color: ACCENT }}>{completeness}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-sand">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${completeness}%`, backgroundColor: ACCENT }} />
              </div>
            </Card>

            {/* Account */}
            <Card title="Account">
              <dl className="space-y-2.5 text-[13px]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Mail className="h-3.5 w-3.5" /> Email</dt>
                  <dd className="truncate font-semibold text-[#342417]">{user?.email ?? "—"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Phone className="h-3.5 w-3.5" /> Phone</dt>
                  <dd className="font-semibold text-[#342417]">{user?.contact ?? "—"}</dd>
                </div>
              </dl>
              <Link href="/dashboard/settings" className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-mist bg-sand/40 px-3 py-2 text-[12px] font-bold text-[#342417] transition hover:border-[#C9B79F]">
                <KeyRound className="h-3.5 w-3.5" /> Change password
              </Link>
            </Card>

            {portfolio && (
              <Card title="Quick facts">
                <dl className="space-y-2.5 text-[13px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><ShieldCheck className="h-3.5 w-3.5" /> Status</dt>
                    <dd className="font-semibold capitalize text-[#342417]">{portfolio.status}</dd>
                  </div>
                  {portfolio.experienceYears != null && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Clock className="h-3.5 w-3.5" /> Experience</dt>
                      <dd className="font-semibold text-[#342417]">{portfolio.experienceYears} yrs</dd>
                    </div>
                  )}
                  {feeText && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="inline-flex items-center gap-1.5 text-[#5C4D3C]/70"><Wallet className="h-3.5 w-3.5" /> Fee</dt>
                      <dd className="text-right font-semibold text-[#342417]">{feeText}</dd>
                    </div>
                  )}
                  {portfolio.referenceId && (
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[#5C4D3C]/70">Ref</dt>
                      <dd className="font-mono text-[12px] font-semibold text-[#342417]">{portfolio.referenceId}</dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {portfolio && (portfolio.serviceAreas?.length ?? 0) > 0 && (
              <Card title="Service areas">
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.serviceAreas!.map((a) => (
                    <span key={a} className="rounded-full bg-sand/60 px-2.5 py-1 text-[12px] font-semibold text-[#5C4D3C]">{a}</span>
                  ))}
                </div>
              </Card>
            )}

            {portfolio && (portfolio.languages?.length ?? 0) > 0 && (
              <Card title="Languages">
                <div className="flex flex-wrap gap-1.5">
                  {portfolio.languages!.map((l) => (
                    <span key={l} className="inline-flex items-center gap-1 rounded-full bg-sand/60 px-2.5 py-1 text-[12px] font-semibold text-[#5C4D3C]">
                      <LangIcon className="h-3 w-3 text-[#157A74]" /> {l}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {socials.length > 0 && (
              <Card title="Links">
                <div className="flex flex-col gap-2">
                  {socials.map(({ key, value }) => {
                    const meta = SOCIAL_META[key];
                    const SIcon = meta.icon;
                    return (
                      <a key={key} href={socialHref(key, value)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#5C4D3C] transition hover:text-[#B05B33]">
                        <SIcon className="h-4 w-4 text-[#5C4D3C]/60" /> {meta.label}
                      </a>
                    );
                  })}
                </div>
              </Card>
            )}

            {portfolio && (
              <button onClick={() => setConfirmDelete(true)} className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-[13px] font-bold text-red-500 transition hover:bg-red-50">
                <Trash2 className="h-4 w-4" /> Delete portfolio
              </button>
            )}
          </aside>
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && portfolio && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={() => !deleting && setConfirmDelete(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-mist bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-extrabold text-[#342417]">Delete your portfolio?</h3>
            <p className="mt-1.5 text-sm text-[#5C4D3C]/75">This removes your public profile and its photos. This can’t be undone.</p>
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setConfirmDelete(false)} disabled={deleting} className="rounded-xl border border-mist bg-white px-4 py-2 text-[13px] font-bold text-[#5C4D3C] transition hover:border-[#C9B79F] disabled:opacity-50">Cancel</button>
              <button onClick={handleDeletePortfolio} disabled={deleting} className="inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-4 py-2 text-[13px] font-bold text-white transition hover:bg-red-600 disabled:opacity-70">
                {deleting ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting…</> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
