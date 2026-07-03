"use client";

import { ChevronDown, Lock } from "lucide-react";
import { PROVINCES, DISTRICTS_BY_PROVINCE } from "@/lib/nepal-geo";
import { inputCls, labelCls, errorCls, helperCls } from "../ui";
import type { StepProps } from "./shared";

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];

function Select({
  value, onChange, placeholder, options, disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: readonly string[];
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} cursor-pointer appearance-none pr-10 ${!value ? "text-[#9A8A78]" : ""}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-[#2E2116]">{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8A78]" />
    </div>
  );
}

export function StepIdentity({ form, update, errors }: StepProps) {
  const districts = form.province ? DISTRICTS_BY_PROVINCE[form.province] ?? [] : [];

  return (
    <div className="space-y-7">
      <p className="rounded-xl border border-[#EAE3D8] bg-[#FAF7F2] px-4 py-3 text-[12px] leading-relaxed text-[#8A7A67]">
        These are your verified personal details. They stay on your account and can be reused
        across NirMix — clients see your display name and city, not sensitive numbers.
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Full name (as per citizenship)<span className="ml-0.5 text-[#B05B33]">*</span></label>
          <input type="text" value={form.fullName} onChange={(e) => update({ fullName: e.target.value })} placeholder="e.g. Ram Bahadur Thapa" className={inputCls} />
          {errors.fullName && <p className={errorCls}>{errors.fullName}</p>}
        </div>
        <div>
          <label className={labelCls}>Display name<span className="ml-0.5 text-[#B05B33]">*</span></label>
          <input type="text" value={form.displayName} onChange={(e) => update({ displayName: e.target.value })} placeholder="Shown publicly, e.g. Er. Ram Thapa" className={inputCls} />
          {errors.displayName && <p className={errorCls}>{errors.displayName}</p>}
        </div>
        <div>
          <label className={labelCls}>Date of birth</label>
          <input type="date" value={form.dob} onChange={(e) => update({ dob: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Gender</label>
          <Select value={form.gender} onChange={(v) => update({ gender: v })} placeholder="Select gender" options={GENDERS} />
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <div className="relative">
            <input type="email" value={form.email} disabled className={`${inputCls} pr-9`} />
            <Lock className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9A8A78]" />
          </div>
          <p className={helperCls}>Verified email — edit it from account settings.</p>
        </div>
        <div>
          <label className={labelCls}>Phone<span className="ml-0.5 text-[#B05B33]">*</span></label>
          <input type="tel" value={form.phone} onChange={(e) => update({ phone: e.target.value })} placeholder="+977 98XXXXXXXX" className={inputCls} />
          {errors.phone && <p className={errorCls}>{errors.phone}</p>}
        </div>
      </div>

      {/* Address cascade */}
      <div>
        <h3 className="mb-3 text-[13px] font-bold uppercase tracking-wide text-[#8A7A67]">Address</h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Province</label>
            <Select
              value={form.province}
              onChange={(v) => update({ province: v, district: "" })}
              placeholder="Select province"
              options={PROVINCES}
            />
          </div>
          <div>
            <label className={labelCls}>District</label>
            <Select
              value={form.district}
              onChange={(v) => update({ district: v })}
              placeholder={form.province ? "Select district" : "Select province first"}
              options={districts}
              disabled={!form.province}
            />
          </div>
          <div>
            <label className={labelCls}>Municipality / City</label>
            <input type="text" value={form.municipality} onChange={(e) => update({ municipality: e.target.value })} placeholder="e.g. Budhanilkantha" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Ward no.</label>
              <input type="text" value={form.ward} onChange={(e) => update({ ward: e.target.value })} placeholder="e.g. 4" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Tole / Area</label>
              <input type="text" value={form.tole} onChange={(e) => update({ tole: e.target.value })} placeholder="e.g. Hattigauda" className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      <div className="sm:w-1/2 sm:pr-2.5">
        <label className={labelCls}>Citizenship / PAN no.</label>
        <input type="text" value={form.citizenshipNo} onChange={(e) => update({ citizenshipNo: e.target.value })} placeholder="Used only for verification" className={inputCls} />
        <p className={helperCls}>Private — used to earn your Verified badge, never shown publicly.</p>
      </div>
    </div>
  );
}
