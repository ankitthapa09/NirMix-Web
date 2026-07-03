"use client";

import { PORTFOLIO_SCHEMAS, isFieldVisible } from "@/lib/portfolio-schemas";
import { PortfolioField, isFullWidthField } from "../PortfolioField";
import type { StepProps } from "./shared";

export function StepExpertise({ form, update, errors }: StepProps) {
  if (!form.category) {
    return (
      <p className="rounded-xl border border-[#EAE3D8] bg-[#FAF7F2] px-4 py-6 text-center text-sm text-[#8A7A67]">
        Pick a category in the first step to see the relevant fields here.
      </p>
    );
  }

  const sections = PORTFOLIO_SCHEMAS[form.category];
  const details = form.details;

  const setDetail = (key: string, value: unknown) =>
    update({ details: { ...details, [key]: value } });

  return (
    <div className="space-y-6">
      {sections.map((section) => {
        const visible = section.fields.filter((f) => isFieldVisible(f, details));
        if (visible.length === 0) return null;

        return (
          <section key={section.id} className="rounded-2xl border border-[#EAE3D8] bg-white p-5 sm:p-6 shadow-[0_1px_2px_rgba(46,33,22,0.04)]">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-[#2E2116]">{section.title}</h3>
              {section.description && (
                <p className="mt-0.5 text-[12px] text-[#8A7A67]">{section.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {visible.map((field) => (
                <div key={field.key} className={isFullWidthField(field) ? "sm:col-span-2" : ""}>
                  <PortfolioField
                    field={field}
                    value={details[field.key] as never}
                    onChange={(v) => setDetail(field.key, v)}
                    error={errors[`details.${field.key}`]}
                  />
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
