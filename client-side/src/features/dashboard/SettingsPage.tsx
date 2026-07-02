"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  ShieldCheck,
  Bell,
  Building2,
  Lock,
  Palette,
  CreditCard,
  TriangleAlert,
  Trash2,
  LogOut,
  Globe,
  Monitor,
  Smartphone,
  Crown,
  Plus,
  Download,
} from "lucide-react";

const ACCENT = "#B05B33";
const DANGER = "#DC2626";

const SECTIONS = [
  { id: "security", label: "Account & Security", icon: ShieldCheck, desc: "Password & sign-in" },
  { id: "notifications", label: "Notifications", icon: Bell, desc: "Alerts & emails" },
  { id: "listing", label: "Listing Preferences", icon: Building2, desc: "Defaults for your listings" },
  { id: "privacy", label: "Privacy", icon: Lock, desc: "Who sees what" },
  { id: "appearance", label: "Appearance & Region", icon: Palette, desc: "Language & display" },
  { id: "billing", label: "Plan & Billing", icon: CreditCard, desc: "Subscription & payments" },
  { id: "danger", label: "Danger Zone", icon: TriangleAlert, desc: "Deactivate or delete" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const DISTRICTS = ["Kathmandu", "Lalitpur", "Bhaktapur", "Kaski", "Chitwan"];

const NOTIF_EVENTS = [
  { id: "inquiries", label: "Inquiries & messages", desc: "When someone contacts you about a listing" },
  { id: "visits", label: "Visit requests", desc: "When a buyer/renter schedules a visit" },
  { id: "matches", label: "Saved-search matches", desc: "New listings matching your saved searches" },
  { id: "pricedrops", label: "Price drops", desc: "Price changes on properties you saved" },
  { id: "status", label: "Listing status updates", desc: "Approval, expiry and verification updates" },
  { id: "newsletter", label: "Tips & newsletter", desc: "Market insights and product news" },
];

const inputCls =
  "w-full rounded-xl border border-[#E0D4C5] bg-[#FAF7F2] px-3.5 py-2.5 text-sm font-medium text-[#342417] placeholder-[#5C4D3C]/40 outline-none transition focus:border-[#B05B33]/40 focus:bg-white focus:ring-2 focus:ring-[#B05B33]/10";

/* ───────────────────────── primitives ───────────────────────── */

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={checked ? { backgroundColor: ACCENT, borderColor: ACCENT } : undefined}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition cursor-pointer ${
        checked ? "" : "border-[#E0D4C5] bg-white"
      }`}
    >
      <span
        className={`mx-0.5 h-4 w-4 rounded-full shadow transition-transform ${
          checked ? "translate-x-5 bg-white" : "bg-[#CBBFA6]"
        }`}
      />
    </button>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-[#E0D4C5] bg-[#FAF7F2] p-1">
      {options.map((o) => {
        const active = value === o;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            style={active ? { backgroundColor: ACCENT, color: "#fff" } : undefined}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition cursor-pointer ${
              active ? "shadow-sm" : "text-[#5C4D3C]/70 hover:text-[#342417]"
            }`}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-[#5C4D3C]/80">{label}</label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-[#5C4D3C]/55">{hint}</p>}
    </div>
  );
}

function Row({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0">
        <p className="text-sm font-bold text-[#342417]">{title}</p>
        {desc && <p className="mt-0.5 text-xs text-[#5C4D3C]/70">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Shell({
  title,
  desc,
  children,
  onSave,
  saveLabel = "Save changes",
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#E8DECF] bg-white shadow-[0_18px_50px_-26px_rgba(52,36,23,0.4)]">
      <div className="border-b border-[#EFE7D8] px-6 py-5">
        <h2 className="text-lg font-extrabold text-[#342417]">{title}</h2>
        <p className="mt-0.5 text-xs text-[#5C4D3C]/70">{desc}</p>
      </div>
      <div className="px-6 py-5">{children}</div>
      {onSave && (
        <div className="flex justify-end gap-3 border-t border-[#EFE7D8] bg-[#FBF7EF] px-6 py-4">
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-[#342417] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#251910] active:scale-[0.99] cursor-pointer"
          >
            {saveLabel}
          </button>
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── page ───────────────────────── */

export function SettingsPage() {
  const { accessToken } = useAuth();
  const [active, setActive] = useState<SectionId>("security");

  // ── state buckets ──
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [savingPwd, setSavingPwd] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  const [notif, setNotif] = useState<Record<string, { email: boolean; sms: boolean; push: boolean }>>(
    () =>
      Object.fromEntries(
        NOTIF_EVENTS.map((e) => [
          e.id,
          { email: e.id !== "newsletter", sms: e.id === "inquiries" || e.id === "visits", push: true },
        ])
      )
  );

  const [listing, setListing] = useState({
    intent: "Buy",
    contact: "Phone",
    unit: "Sq.Ft",
    currency: "NPR (Rs)",
    city: "Lalitpur",
    autoRenew: true,
    hideAddress: false,
  });

  const [privacy, setPrivacy] = useState({
    visibility: "Public",
    showPhone: true,
    showEmail: false,
    allowMessages: true,
    indexProfile: true,
    activityStatus: true,
  });

  const [appearance, setAppearance] = useState({
    theme: "Light",
    language: "English",
    region: "Nepal (NPT)",
    dateFormat: "DD/MM/YYYY",
  });

  const save = (label: string) => toast.success(`${label} updated.`);

  const savePassword = async () => {
    if (!pwd.current || !pwd.next || !pwd.confirm) return toast.error("Fill in all password fields.");
    if (pwd.next.length < 8) return toast.error("New password must be at least 8 characters.");
    if (pwd.next !== pwd.confirm) return toast.error("New passwords do not match.");
    if (pwd.next === pwd.current) return toast.error("New password must be different from the current one.");
    if (!accessToken) return toast.error("Please sign in again to change your password.");
    if (savingPwd) return;

    setSavingPwd(true);
    try {
      const res = await fetch("http://localhost:5001/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ currentPassword: pwd.current, newPassword: pwd.next }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.message || "Failed to update password.");
        return;
      }
      setPwd({ current: "", next: "", confirm: "" });
      toast.success("Password changed.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[#342417] sm:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-[#5C4D3C]/70">
          Manage your account, listings, notifications and privacy.
        </p>
      </div>

      <div className="flex flex-col gap-6 md:grid md:grid-cols-[240px_1fr] md:gap-6 lg:grid-cols-[260px_1fr] lg:gap-8">
        {/* Section nav */}
        <aside className="md:sticky md:top-24 md:self-start">
          <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-[#E8DECF] bg-white/80 p-2 md:flex-col md:overflow-visible [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => {
              const isActive = active === s.id;
              const danger = s.id === "danger";
              const tint = danger ? DANGER : ACCENT;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActive(s.id)}
                  style={isActive ? { backgroundColor: `${tint}12`, color: "#342417" } : undefined}
                  className={`group flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition cursor-pointer md:w-full ${
                    isActive ? "" : "hover:bg-[#FAF7F2]"
                  }`}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition"
                    style={{
                      backgroundColor: isActive ? tint : `${tint}14`,
                      color: isActive ? "#fff" : tint,
                    }}
                  >
                    <s.icon className="h-4 w-4" />
                  </span>
                  <span className="hidden min-w-0 md:block">
                    <span
                      className={`block truncate text-sm font-bold ${danger ? "text-[#B91C1C]" : "text-[#342417]"}`}
                    >
                      {s.label}
                    </span>
                    <span className="block truncate text-[11px] text-[#5C4D3C]/55">{s.desc}</span>
                  </span>
                  <span className="text-sm font-bold md:hidden">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Panel */}
        <div className="min-w-0">
          {active === "security" && (
            <div className="space-y-6">
              <Shell title="Password" desc="Use a strong password you don't use elsewhere." onSave={savePassword} saveLabel={savingPwd ? "Updating…" : "Update password"}>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2 sm:max-w-sm">
                    <Field label="Current password">
                      <input type="password" className={inputCls} value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
                    </Field>
                  </div>
                  <Field label="New password" hint="At least 8 characters.">
                    <input type="password" className={inputCls} value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm new password">
                    <input type="password" className={inputCls} value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} placeholder="••••••••" />
                  </Field>
                </div>
              </Shell>

              <Shell title="Two-factor authentication" desc="Add an extra layer of security to your account.">
                <div className="divide-y divide-[#EFE7D8]">
                  <Row title="Authenticator app (2FA)" desc="Require a 6-digit code at sign-in.">
                    <Toggle checked={twoFA} onChange={(v) => { setTwoFA(v); toast.success(v ? "2FA enabled." : "2FA disabled."); }} />
                  </Row>
                  <Row title="Login alerts" desc="Email me about new sign-ins to my account.">
                    <Toggle checked={loginAlerts} onChange={(v) => { setLoginAlerts(v); save("Login alerts"); }} />
                  </Row>
                </div>
              </Shell>

              <Shell title="Active sessions" desc="Devices currently signed in to your account.">
                <div className="space-y-3">
                  {[
                    { icon: Monitor, name: "Chrome · macOS", meta: "Kathmandu, Nepal · Active now", current: true },
                    { icon: Smartphone, name: "Safari · iPhone", meta: "Lalitpur, Nepal · 2 days ago", current: false },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between gap-3 rounded-xl border border-[#E8DECF] bg-[#FAF7F2] px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-[#342417] shadow-sm">
                          <s.icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="flex items-center gap-2 text-sm font-bold text-[#342417]">
                            {s.name}
                            {s.current && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">This device</span>}
                          </p>
                          <p className="text-[11px] text-[#5C4D3C]/60">{s.meta}</p>
                        </div>
                      </div>
                      {!s.current && (
                        <button type="button" onClick={() => toast.success("Session signed out.")} className="rounded-lg border border-[#E0D4C5] bg-white px-3 py-1.5 text-xs font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer">
                          Sign out
                        </button>
                      )}
                    </div>
                  ))}
                  <button type="button" onClick={() => toast.success("Signed out of all other devices.")} className="flex items-center gap-2 text-xs font-bold text-[#B05B33] hover:underline cursor-pointer">
                    <LogOut className="h-3.5 w-3.5" /> Sign out of all other sessions
                  </button>
                </div>
              </Shell>
            </div>
          )}

          {active === "notifications" && (
            <Shell title="Notifications" desc="Choose how you want to hear from NirMix." onSave={() => save("Notification preferences")}>
              <div className="divide-y divide-[#EFE7D8]">
                {NOTIF_EVENTS.map((e) => (
                  <div key={e.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-[#342417]">{e.label}</p>
                      <p className="mt-0.5 text-xs text-[#5C4D3C]/70">{e.desc}</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-6 sm:gap-7">
                      {(["email", "sms", "push"] as const).map((ch) => (
                        <div key={ch} className="flex flex-col items-center gap-1.5">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#5C4D3C]/50">{ch}</span>
                          <Toggle
                            checked={notif[e.id][ch]}
                            onChange={(v) => setNotif((n) => ({ ...n, [e.id]: { ...n[e.id], [ch]: v } }))}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Shell>
          )}

          {active === "listing" && (
            <Shell title="Listing Preferences" desc="Defaults applied when you create a new listing." onSave={() => save("Listing preferences")}>
              <div className="divide-y divide-[#EFE7D8]">
                <Row title="Default listing intent" desc="Pre-select when posting a property.">
                  <Segmented options={["Buy", "Rent"]} value={listing.intent} onChange={(v) => setListing((l) => ({ ...l, intent: v }))} />
                </Row>
                <Row title="Preferred contact method" desc="How buyers reach you first.">
                  <Segmented options={["Phone", "Chat", "Email"]} value={listing.contact} onChange={(v) => setListing((l) => ({ ...l, contact: v }))} />
                </Row>
                <Row title="Measurement unit" desc="Area unit shown on your listings.">
                  <Segmented options={["Sq.Ft", "Aana", "Sq.M"]} value={listing.unit} onChange={(v) => setListing((l) => ({ ...l, unit: v }))} />
                </Row>
                <Row title="Currency">
                  <select className={`${inputCls} w-44`} value={listing.currency} onChange={(e) => setListing((l) => ({ ...l, currency: e.target.value }))}>
                    <option>NPR (Rs)</option>
                    <option>USD ($)</option>
                    <option>INR (₹)</option>
                  </select>
                </Row>
                <Row title="Default city">
                  <select className={`${inputCls} w-44`} value={listing.city} onChange={(e) => setListing((l) => ({ ...l, city: e.target.value }))}>
                    {DISTRICTS.map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </Row>
                <Row title="Auto-renew listings" desc="Keep listings live by renewing before they expire.">
                  <Toggle checked={listing.autoRenew} onChange={(v) => setListing((l) => ({ ...l, autoRenew: v }))} />
                </Row>
                <Row title="Hide exact address" desc="Show approximate area until a buyer inquires.">
                  <Toggle checked={listing.hideAddress} onChange={(v) => setListing((l) => ({ ...l, hideAddress: v }))} />
                </Row>
              </div>
            </Shell>
          )}

          {active === "privacy" && (
            <Shell title="Privacy" desc="Control your visibility and who can reach you." onSave={() => save("Privacy settings")}>
              <div className="divide-y divide-[#EFE7D8]">
                <Row title="Profile visibility" desc="Who can view your public profile.">
                  <Segmented options={["Public", "Registered", "Private"]} value={privacy.visibility} onChange={(v) => setPrivacy((p) => ({ ...p, visibility: v }))} />
                </Row>
                <Row title="Show phone number publicly" desc="Display your number on listings.">
                  <Toggle checked={privacy.showPhone} onChange={(v) => setPrivacy((p) => ({ ...p, showPhone: v }))} />
                </Row>
                <Row title="Show email publicly">
                  <Toggle checked={privacy.showEmail} onChange={(v) => setPrivacy((p) => ({ ...p, showEmail: v }))} />
                </Row>
                <Row title="Allow direct messages" desc="Let users message you on NirMix.">
                  <Toggle checked={privacy.allowMessages} onChange={(v) => setPrivacy((p) => ({ ...p, allowMessages: v }))} />
                </Row>
                <Row title="Search engine indexing" desc="Allow Google to index your public profile.">
                  <Toggle checked={privacy.indexProfile} onChange={(v) => setPrivacy((p) => ({ ...p, indexProfile: v }))} />
                </Row>
                <Row title="Show activity status" desc="Display when you were last active.">
                  <Toggle checked={privacy.activityStatus} onChange={(v) => setPrivacy((p) => ({ ...p, activityStatus: v }))} />
                </Row>
              </div>
            </Shell>
          )}

          {active === "appearance" && (
            <Shell title="Appearance & Region" desc="Personalise how NirMix looks and reads." onSave={() => save("Display preferences")}>
              <div className="divide-y divide-[#EFE7D8]">
                <Row title="Theme" desc="Dark mode coming soon.">
                  <Segmented options={["Light", "System"]} value={appearance.theme} onChange={(v) => setAppearance((a) => ({ ...a, theme: v }))} />
                </Row>
                <Row title="Language">
                  <div className="relative">
                    <Globe className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5C4D3C]/40" />
                    <select className={`${inputCls} w-48 pl-9`} value={appearance.language} onChange={(e) => setAppearance((a) => ({ ...a, language: e.target.value }))}>
                      <option>English</option>
                      <option>Nepali</option>
                    </select>
                  </div>
                </Row>
                <Row title="Region & timezone">
                  <select className={`${inputCls} w-48`} value={appearance.region} onChange={(e) => setAppearance((a) => ({ ...a, region: e.target.value }))}>
                    <option>Nepal (NPT)</option>
                    <option>India (IST)</option>
                  </select>
                </Row>
                <Row title="Date format">
                  <select className={`${inputCls} w-48`} value={appearance.dateFormat} onChange={(e) => setAppearance((a) => ({ ...a, dateFormat: e.target.value }))}>
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </Row>
              </div>
            </Shell>
          )}

          {active === "billing" && (
            <div className="space-y-6">
              <Shell title="Your plan" desc="Upgrade for more active listings and premium placement.">
                <div className="flex flex-col gap-4 rounded-2xl border border-[#E8DECF] bg-[#FBF7EF] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundColor: ACCENT }}>
                      <Crown className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold text-[#342417]">Free plan</p>
                      <p className="text-xs text-[#5C4D3C]/70">Up to 3 active listings · standard placement</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => toast.success("Redirecting to plans…")} className="rounded-xl bg-[#342417] px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-[#251910] cursor-pointer">
                    Upgrade to Agent Pro
                  </button>
                </div>
              </Shell>

              <Shell title="Payment methods" desc="Add a card for subscriptions and featured listings.">
                <button type="button" onClick={() => toast.success("Add payment method")} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[#E0D4C5] bg-[#FAF7F2] px-4 py-5 text-sm font-bold text-[#5C4D3C]/80 transition hover:border-[#342417]/30 hover:text-[#342417] cursor-pointer">
                  <Plus className="h-4 w-4" /> Add payment method
                </button>
              </Shell>

              <Shell title="Billing history" desc="Your invoices and receipts.">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Download className="mb-2 h-7 w-7 text-[#5C4D3C]/30" />
                  <p className="text-sm font-bold text-[#342417]">No invoices yet</p>
                  <p className="text-xs text-[#5C4D3C]/60">Invoices appear here once you subscribe.</p>
                </div>
              </Shell>
            </div>
          )}

          {active === "danger" && (
            <div className="overflow-hidden rounded-3xl border border-red-200 bg-white shadow-[0_18px_50px_-26px_rgba(220,38,38,0.4)]">
              <div className="border-b border-red-100 bg-red-50/60 px-6 py-5">
                <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#B91C1C]">
                  <TriangleAlert className="h-5 w-5" /> Danger Zone
                </h2>
                <p className="mt-0.5 text-xs text-[#B91C1C]/70">These actions are permanent or disruptive — proceed carefully.</p>
              </div>
              <div className="divide-y divide-red-100 px-6">
                <Row title="Deactivate account" desc="Temporarily hide your profile and listings. Reactivate anytime.">
                  <button type="button" onClick={() => toast.success("Account deactivated.")} className="rounded-xl border border-red-300 bg-white px-4 py-2.5 text-sm font-bold text-[#B91C1C] transition hover:bg-red-50 cursor-pointer">
                    Deactivate
                  </button>
                </Row>
                <Row title="Export my data" desc="Download a copy of your account data and listings.">
                  <button type="button" onClick={() => toast.success("Export started — we'll email you a link.")} className="rounded-xl border border-[#E0D4C5] bg-white px-4 py-2.5 text-sm font-bold text-[#342417] transition hover:border-[#342417]/25 cursor-pointer">
                    Request export
                  </button>
                </Row>
                <Row title="Delete account" desc="Permanently delete your account, listings and data. This cannot be undone.">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Delete your account permanently? This cannot be undone.")) {
                        toast.success("Account deletion requested.");
                      }
                    }}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:brightness-105 cursor-pointer"
                    style={{ backgroundColor: DANGER }}
                  >
                    <Trash2 className="h-4 w-4" /> Delete account
                  </button>
                </Row>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
