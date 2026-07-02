"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  Pencil,
  Check,
  X,
  Camera,
  MapPin,
  Mail,
  Phone,
  Globe,
  CalendarDays,
  BadgeCheck,
  ShieldCheck,
  Briefcase,
  Award,
  Languages as LanguagesIcon,
  Building2,
  User as UserIcon,
  Home,
  Eye,
  Heart,
  Star,
  Settings,
  Link2,
  AtSign,
  MessageCircle,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";

const ACCENT = "#B05B33";

const LANGUAGE_OPTIONS = ["English", "Nepali", "Hindi", "Newari", "Maithili"];
const SPECIALIZATION_OPTIONS = [
  "Residential",
  "Commercial",
  "Land & Plots",
  "Luxury Homes",
  "Rentals",
  "Apartments",
];

const ACCOUNT_TYPES = ["Personal", "Agent", "Builder"] as const;

const TYPE_TINT: Record<string, string> = {
  Personal: "#157A74",
  Agent: "#B05B33",
  Builder: "#7A5418",
};

const TYPE_ICON: Record<string, typeof UserIcon> = {
  Personal: UserIcon,
  Agent: Briefcase,
  Builder: Building2,
};

interface ProfileForm {
  name: string;
  accountType: string;
  email: string;
  phone: string;
  city: string;
  address: string;
  bio: string;
  languages: string[];
  // professional
  company: string;
  license: string;
  experience: string;
  specializations: string[];
  serviceAreas: string;
  // social
  website: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
  memberSince: string;
}

const inputCls =
  "w-full rounded-xl border border-[#E0D4C5] bg-[#FAF7F2] px-3.5 py-2.5 text-sm font-medium text-[#342417] placeholder-[#5C4D3C]/40 outline-none transition focus:border-[#B05B33]/40 focus:bg-white focus:ring-2 focus:ring-[#B05B33]/10";

export function ProfilePage() {
  const { user, updateUser, accessToken } = useAuth();

  const initial: ProfileForm = {
    name: user?.name ?? "Ram Thapa",
    accountType: "Agent",
    email: user?.email ?? "ram@example.com",
    phone: user?.contact ?? "+977 9801234567",
    city: "Lalitpur",
    address: "Bhaisepati, Ward 5, Lalitpur",
    bio: "Helping families find the right home across the Kathmandu valley. Specialising in verified residential listings with transparent pricing and end-to-end support.",
    languages: ["English", "Nepali"],
    company: "NirMix Premium",
    license: "NP-RE-2024-1182",
    experience: "6",
    specializations: ["Residential", "Luxury Homes", "Apartments"],
    serviceAreas: "Lalitpur, Kathmandu, Bhaktapur",
    website: "https://nirmix.com.np",
    facebook: "nirmix",
    instagram: "nirmix.realty",
    whatsapp: "+977 9801234567",
    memberSince: "Jan 2024",
  };

  const [form, setForm] = useState<ProfileForm>(initial);
  const [draft, setDraft] = useState<ProfileForm>(initial);
  const [editing, setEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!accessToken) {
      toast.error("Please log in to update your photo.");
      return;
    }

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      const res = await apiFetch("http://localhost:5001/api/users/me/avatar", {
        method: "PATCH",
        body: fd,
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to update photo.");
        return;
      }
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
    if (!user?.avatar) return;
    if (!accessToken) {
      toast.error("Please log in to update your photo.");
      return;
    }
    if (!confirm("Remove your profile picture?")) return;

    setRemovingAvatar(true);
    try {
      const res = await apiFetch("http://localhost:5001/api/users/me/avatar", {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to remove photo.");
        return;
      }
      updateUser({ avatar: "" });
      toast.success("Profile picture removed.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setRemovingAvatar(false);
    }
  };

  const v = editing ? draft : form;
  const isPro = v.accountType !== "Personal";
  const TypeIcon = TYPE_ICON[v.accountType] ?? UserIcon;
  const typeTint = TYPE_TINT[v.accountType] ?? ACCENT;

  const initials =
    v.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const startEdit = () => {
    setDraft(form);
    setEditing(true);
  };
  const cancel = () => setEditing(false);
  const saveAll = () => {
    setForm(draft);
    setEditing(false);
    toast.success("Profile updated.");
  };

  const setDraftField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  const toggleInArray = (key: "languages" | "specializations", item: string) =>
    setDraft((d) => ({
      ...d,
      [key]: d[key].includes(item) ? d[key].filter((x) => x !== item) : [...d[key], item],
    }));

  // crude profile completeness
  const completeness = (() => {
    const checks = [v.bio, v.phone, v.city, v.address, v.languages.length > 0, isPro ? v.company : "x", v.website];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  })();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* ── Cover + identity ── */}
      <div className="overflow-hidden rounded-3xl border border-[#E8DECF] bg-white shadow-[0_18px_50px_-26px_rgba(52,36,23,0.4)]">
        <div className="relative h-36 sm:h-44">
          <div className="absolute inset-0 bg-gradient-to-r from-[#342417] via-[#5C4D3C] to-[#342417]" />
          <div className="absolute inset-0 opacity-[0.12] bg-[radial-gradient(circle_at_center,#FFFFFF_1.5px,transparent_1.5px)] bg-[size:20px_20px]" />
          <div className="absolute inset-0" style={{ background: `radial-gradient(120% 120% at 90% 0%, ${ACCENT}55, transparent 55%)` }} />
        </div>

        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="-mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border-4 border-white bg-[#342417] text-2xl font-extrabold text-white shadow-lg sm:h-28 sm:w-28">
                  {user?.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={v.name} className="h-full w-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                {editing && (
                  <>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl text-white shadow-md cursor-pointer disabled:opacity-60"
                      style={{ backgroundColor: ACCENT }}
                    >
                      {uploadingAvatar ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                  </>
                )}
                {editing && user?.avatar && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    disabled={removingAvatar}
                    aria-label="Remove photo"
                    className="absolute -top-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-red-500 text-white shadow-md transition hover:bg-red-600 cursor-pointer disabled:opacity-60"
                  >
                    {removingAvatar ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
              <div className="pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  {editing ? (
                    <input
                      className={`${inputCls} max-w-xs text-lg font-extrabold`}
                      value={draft.name}
                      onChange={(e) => setDraftField("name", e.target.value)}
                    />
                  ) : (
                    <h1 className="text-2xl font-extrabold tracking-tight text-[#342417]">{form.name}</h1>
                  )}
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-extrabold"
                    style={{ backgroundColor: `${typeTint}1a`, color: typeTint }}
                  >
                    <TypeIcon className="h-3.5 w-3.5" />
                    {v.accountType}
                  </span>
                  {user?.isEmailVerified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-extrabold text-emerald-700">
                      <BadgeCheck className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#5C4D3C]/75">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {v.city}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" /> Member since {v.memberSince}
                  </span>
                  {isPro && v.company && (
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" /> {v.company}
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex shrink-0 items-center gap-2">
              {editing ? (
                <>
                  <button
                    type="button"
                    onClick={cancel}
                    className="flex items-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-white px-4 py-2.5 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveAll}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:brightness-105 cursor-pointer"
                    style={{ backgroundColor: ACCENT }}
                  >
                    <Check className="h-4 w-4" /> Save changes
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-1.5 rounded-xl border border-[#E0D4C5] bg-white px-4 py-2.5 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <button
                    type="button"
                    onClick={startEdit}
                    className="flex items-center gap-1.5 rounded-xl bg-[#342417] px-4 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#251910] cursor-pointer"
                  >
                    <Pencil className="h-4 w-4" /> Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat icon={Home} label="Active listings" value="12" />
            <Stat icon={Eye} label="Profile views" value="3.4k" />
            <Stat icon={Heart} label="Saved by" value="287" />
            <Stat icon={Star} label="Rating" value="4.8" sub="· 41 reviews" />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="mt-6 flex flex-col gap-6 lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
        {/* Left */}
        <div className="min-w-0 space-y-6">
          {/* About */}
          <Card title="About" icon={UserIcon}>
            {editing ? (
              <textarea
                rows={4}
                className={`${inputCls} resize-none`}
                value={draft.bio}
                onChange={(e) => setDraftField("bio", e.target.value)}
                placeholder="Write a short bio…"
              />
            ) : (
              <p className="text-sm leading-relaxed text-[#5C4D3C]">{form.bio || "No bio added yet."}</p>
            )}
          </Card>

          {/* Professional details */}
          {isPro && (
            <Card title="Professional details" icon={Award} accent={typeTint}>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormRow label="Company / Agency" editing={editing} value={v.company}>
                  <input className={inputCls} value={draft.company} onChange={(e) => setDraftField("company", e.target.value)} />
                </FormRow>
                <FormRow label="License / Reg. number" editing={editing} value={v.license}>
                  <input className={inputCls} value={draft.license} onChange={(e) => setDraftField("license", e.target.value)} />
                </FormRow>
                <FormRow label="Experience" editing={editing} value={`${v.experience} years`}>
                  <input type="number" className={inputCls} value={draft.experience} onChange={(e) => setDraftField("experience", e.target.value)} />
                </FormRow>
                <FormRow label="Service areas" editing={editing} value={v.serviceAreas}>
                  <input className={inputCls} value={draft.serviceAreas} onChange={(e) => setDraftField("serviceAreas", e.target.value)} />
                </FormRow>
              </div>

              <div className="mt-5">
                <p className="mb-2 text-xs font-bold text-[#5C4D3C]/80">Specializations</p>
                {editing ? (
                  <ChipSelect options={SPECIALIZATION_OPTIONS} selected={draft.specializations} onToggle={(s) => toggleInArray("specializations", s)} />
                ) : (
                  <ChipList items={form.specializations} />
                )}
              </div>
            </Card>
          )}

          {/* Contact info */}
          <Card title="Contact information" icon={Phone}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FormRow label="Email" editing={editing} value={v.email} icon={Mail}>
                <input className={inputCls} value={draft.email} onChange={(e) => setDraftField("email", e.target.value)} />
              </FormRow>
              <FormRow label="Phone" editing={editing} value={v.phone} icon={Phone}>
                <input className={inputCls} value={draft.phone} onChange={(e) => setDraftField("phone", e.target.value)} />
              </FormRow>
              <FormRow label="City" editing={editing} value={v.city} icon={MapPin}>
                <input className={inputCls} value={draft.city} onChange={(e) => setDraftField("city", e.target.value)} />
              </FormRow>
              <FormRow label="Address" editing={editing} value={v.address} icon={MapPin}>
                <input className={inputCls} value={draft.address} onChange={(e) => setDraftField("address", e.target.value)} />
              </FormRow>
            </div>
          </Card>

          {/* Languages */}
          <Card title="Languages spoken" icon={LanguagesIcon}>
            {editing ? (
              <ChipSelect options={LANGUAGE_OPTIONS} selected={draft.languages} onToggle={(l) => toggleInArray("languages", l)} />
            ) : (
              <ChipList items={form.languages} />
            )}
          </Card>
        </div>

        {/* Right rail */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {/* Account type (edit) */}
          {editing && (
            <Card title="Account type">
              <div className="flex flex-wrap gap-1.5">
                {ACCOUNT_TYPES.map((t) => {
                  const on = draft.accountType === t;
                  return (
                    <button key={t} type="button" onClick={() => setDraftField("accountType", t)} style={on ? { backgroundColor: ACCENT, color: "#fff" } : undefined} className={`rounded-lg border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${on ? "border-transparent" : "border-[#E0D4C5] bg-white text-[#5C4D3C]/70 hover:text-[#342417]"}`}>
                      {t}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Completeness */}
          <div className="rounded-2xl border border-[#E8DECF] bg-white p-5 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-sm font-bold text-[#342417]">Profile strength</p>
              <span className="text-sm font-extrabold" style={{ color: ACCENT }}>{completeness}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#EFE7D8]">
              <div className="h-full rounded-full transition-all" style={{ width: `${completeness}%`, backgroundColor: ACCENT }} />
            </div>
            <p className="mt-2 text-[11px] text-[#5C4D3C]/65">
              {completeness >= 100 ? "Your profile looks great!" : "Complete your profile to build buyer trust."}
            </p>
          </div>

          {/* Verification */}
          <Card title="Verification" icon={ShieldCheck} accent="#157A74">
            <div className="space-y-3">
              <VerifyRow label="Email address" done={!!user?.isEmailVerified} />
              <VerifyRow label="Phone number" done />
              <VerifyRow label="Identity (KYC)" done={false} actionLabel="Verify" />
            </div>
          </Card>

          {/* Social */}
          <Card title="Social & web" icon={Globe}>
            {editing ? (
              <div className="space-y-3">
                <SocialInput icon={Globe} value={draft.website} onChange={(x) => setDraftField("website", x)} placeholder="Website URL" />
                <SocialInput icon={Link2} value={draft.facebook} onChange={(x) => setDraftField("facebook", x)} placeholder="Facebook username" />
                <SocialInput icon={AtSign} value={draft.instagram} onChange={(x) => setDraftField("instagram", x)} placeholder="Instagram handle" />
                <SocialInput icon={MessageCircle} value={draft.whatsapp} onChange={(x) => setDraftField("whatsapp", x)} placeholder="WhatsApp number" />
              </div>
            ) : (
              <div className="space-y-2.5">
                <SocialLink icon={Globe} label={form.website || "—"} />
                <SocialLink icon={Link2} label={form.facebook ? `@${form.facebook}` : "—"} />
                <SocialLink icon={AtSign} label={form.instagram ? `@${form.instagram}` : "—"} />
                <SocialLink icon={MessageCircle} label={form.whatsapp || "—"} />
              </div>
            )}
          </Card>

          {/* Member since */}
          <div className="flex items-center gap-3 rounded-2xl border border-[#E8DECF] bg-[#FBF7EF] p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
              <Clock className="h-4 w-4" />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wide text-[#5C4D3C]/55">Member since</p>
              <p className="text-sm font-extrabold text-[#342417]">{v.memberSince}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ───────── helpers ───────── */

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Home; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-[#E8DECF] bg-[#FBF7EF] px-4 py-3.5">
      <span className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${ACCENT}14`, color: ACCENT }}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="text-lg font-extrabold leading-none text-[#342417]">
        {value} {sub && <span className="text-[11px] font-semibold text-[#5C4D3C]/55">{sub}</span>}
      </p>
      <p className="mt-1 text-[11px] font-bold text-[#5C4D3C]/60">{label}</p>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  accent = "#342417",
  children,
}: {
  title: string;
  icon?: typeof Home;
  accent?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-[#E8DECF] bg-white p-5 sm:p-6 shadow-sm">
      <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-[#342417]">
        {Icon && <Icon className="h-4.5 w-4.5" style={{ color: accent }} />}
        {title}
      </h2>
      {children}
    </section>
  );
}

function FormRow({
  label,
  value,
  editing,
  icon: Icon,
  children,
}: {
  label: string;
  value: string;
  editing: boolean;
  icon?: typeof Home;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-bold text-[#5C4D3C]/80">{label}</p>
      {editing ? (
        children
      ) : (
        <p className="flex items-center gap-2 text-sm font-semibold text-[#342417]">
          {Icon && <Icon className="h-4 w-4 shrink-0 text-[#5C4D3C]/45" />}
          {value || "—"}
        </p>
      )}
    </div>
  );
}

function ChipList({ items }: { items: string[] }) {
  if (items.length === 0) return <p className="text-sm text-[#5C4D3C]/55">—</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => (
        <span key={i} className="rounded-full border border-[#E0D4C5] bg-[#FAF7F2] px-3 py-1.5 text-xs font-bold text-[#342417]">
          {i}
        </span>
      ))}
    </div>
  );
}

function ChipSelect({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = selected.includes(o);
        return (
          <button key={o} type="button" onClick={() => onToggle(o)} style={on ? { borderColor: ACCENT, backgroundColor: `${ACCENT}12`, color: "#342417" } : undefined} className={`inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-bold transition cursor-pointer ${on ? "" : "border-[#E0D4C5] bg-white text-[#5C4D3C]/70 hover:text-[#342417]"}`}>
            {on && <Check className="h-3 w-3" style={{ color: ACCENT }} />}
            {o}
          </button>
        );
      })}
    </div>
  );
}

function VerifyRow({ label, done, actionLabel }: { label: string; done: boolean; actionLabel?: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-sm font-semibold text-[#342417]">
        <BadgeCheck className={`h-4 w-4 ${done ? "text-emerald-600" : "text-[#5C4D3C]/30"}`} />
        {label}
      </span>
      {done ? (
        <span className="text-[11px] font-extrabold text-emerald-600">Verified</span>
      ) : (
        <button type="button" onClick={() => toast.success("Verification started.")} className="text-[11px] font-extrabold cursor-pointer" style={{ color: ACCENT }}>
          {actionLabel ?? "Verify"}
        </button>
      )}
    </div>
  );
}

function SocialLink({ icon: Icon, label }: { icon: typeof Home; label: string }) {
  return (
    <p className="flex items-center gap-2.5 text-sm font-semibold text-[#342417]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FAF7F2] text-[#5C4D3C]/70">
        <Icon className="h-4 w-4" />
      </span>
      <span className="truncate">{label}</span>
    </p>
  );
}

function SocialInput({ icon: Icon, value, onChange, placeholder }: { icon: typeof Home; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
      <input className={`${inputCls} pl-9`} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}
