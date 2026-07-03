"use client";

import { Check, Plus, Minus, ChevronDown } from "lucide-react";
import type { FieldConfig } from "@/lib/portfolio-schemas";
import { inputCls, labelCls, helperCls, errorCls, ACCENT } from "./ui";

type Value = string | number | boolean | string[] | undefined;

interface PortfolioFieldProps {
  field: FieldConfig;
  value: Value;
  onChange: (value: Value) => void;
  error?: string;
}

/** Renders one schema field. The 2-col grid width is handled by the parent. */
export function PortfolioField({ field, value, onChange, error }: PortfolioFieldProps) {
  const hasError = !!error;

  const control = () => {
    switch (field.type) {
      case "textarea":
        return (
          <textarea
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`${inputCls} resize-y leading-relaxed`}
          />
        );

      case "number":
        return (
          <div className="relative">
            <input
              type="number"
              value={(value as string) ?? ""}
              min={field.min}
              max={field.max}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              className={`${inputCls} ${field.suffix ? "pr-14" : ""}`}
            />
            {field.suffix && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase tracking-wide text-[#9A8A78]">
                {field.suffix}
              </span>
            )}
          </div>
        );

      case "dropdown":
        return (
          <div className="relative">
            <select
              value={(value as string) || ""}
              onChange={(e) => onChange(e.target.value)}
              className={`${inputCls} cursor-pointer appearance-none pr-10 ${!value ? "text-[#9A8A78]" : ""}`}
            >
              <option value="" disabled>{field.placeholder || "Select an option"}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt} className="text-[#2E2116]">{opt}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9A8A78]" />
          </div>
        );

      case "card-select":
        return (
          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {field.options?.map((opt) => {
              const selected = value === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange(opt)}
                  className={`relative rounded-xl border px-3 py-3 text-left text-[13px] font-semibold transition-all ${
                    selected
                      ? "border-[#B05B33] bg-[#B05B33]/[0.06] text-[#3A2C1E] shadow-[0_0_0_1px_rgba(176,91,51,0.4)]"
                      : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                  }`}
                >
                  {opt}
                  {selected && (
                    <span
                      className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: ACCENT }}
                    >
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        );

      case "chip-multiselect": {
        const selected = Array.isArray(value) ? value : [];
        return (
          <div className="flex flex-wrap gap-2">
            {field.options?.map((opt) => {
              const on = selected.includes(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() =>
                    onChange(on ? selected.filter((s) => s !== opt) : [...selected, opt])
                  }
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-all ${
                    on
                      ? "border-[#B05B33] bg-[#B05B33]/[0.08] text-[#3A2C1E]"
                      : "border-[#E4DCD0] bg-white text-[#5C4D3C] hover:border-[#C9B79F]"
                  }`}
                >
                  {on && <Check className="h-3 w-3 stroke-[3]" style={{ color: ACCENT }} />}
                  {opt}
                </button>
              );
            })}
          </div>
        );
      }

      case "toggle": {
        const on = !!value;
        return (
          <div className="inline-flex rounded-xl border border-[#E4DCD0] bg-[#F5F1EA] p-1">
            {[true, false].map((state) => (
              <button
                key={String(state)}
                type="button"
                onClick={() => onChange(state)}
                className={`rounded-lg px-5 py-1.5 text-[12px] font-bold transition-all ${
                  on === state
                    ? "bg-white text-[#3A2C1E] shadow-sm"
                    : "text-[#8A7A67] hover:text-[#5C4D3C]"
                }`}
              >
                {state ? "Yes" : "No"}
              </button>
            ))}
          </div>
        );
      }

      case "stepper": {
        const n = Number(value) || 0;
        return (
          <div className="inline-flex items-center gap-3 rounded-xl border border-[#E4DCD0] bg-white p-1.5">
            <button
              type="button"
              onClick={() => onChange(Math.max(field.min ?? 0, n - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F1EA] text-[#5C4D3C] transition hover:bg-[#EAE3D8] active:scale-90"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm font-bold text-[#2E2116]">{n}</span>
            <button
              type="button"
              onClick={() => onChange(Math.min(field.max ?? 9999, n + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F1EA] text-[#5C4D3C] transition hover:bg-[#EAE3D8] active:scale-90"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        );
      }

      case "text":
      default:
        return (
          <input
            type="text"
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={inputCls}
          />
        );
    }
  };

  return (
    <div>
      <label className={labelCls}>
        {field.label}
        {field.required && <span className="ml-0.5 text-[#B05B33]">*</span>}
      </label>
      {control()}
      {field.helper && !hasError && <p className={helperCls}>{field.helper}</p>}
      {hasError && <p className={errorCls}>{error}</p>}
    </div>
  );
}

/** Which field types span the full width of the 2-col grid. */
export function isFullWidthField(field: FieldConfig): boolean {
  return (
    field.fullWidth === true ||
    field.type === "textarea" ||
    field.type === "card-select" ||
    field.type === "chip-multiselect"
  );
}
