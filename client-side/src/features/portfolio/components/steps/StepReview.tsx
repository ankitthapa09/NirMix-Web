"use client";

import { CATEGORY_LABELS, PORTFOLIO_SCHEMAS } from "@/lib/portfolio-schemas";
import type { StepProps } from "./shared";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0)) return null;
  return (
    <div className="flex gap-3 py-1.5 text-sm">
      <span className="w-40 shrink-0 font-semibold text-[#8A7A67]">{label}</span>
      <span className="text-[#2E2116]">{Array.isArray(value) ? value.join(", ") : value}</span>
    </div>
  );
}

function Card({ title, children, onEdit }: { title: string; children: React.ReactNode; onEdit?: () => void }) {
  return (
    <section className="rounded-2xl border border-[#EAE3D8] bg-white p-5 shadow-[0_1px_2px_rgba(46,33,22,0.04)]">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#2E2116]">{title}</h3>
        {onEdit && (
          <button type="button" onClick={onEdit} className="text-[12px] font-semibold text-[#B05B33] hover:underline">
            Edit
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

interface StepReviewProps extends StepProps {
  onGoToStep: (i: number) => void;
}

export function StepReview({ form, onGoToStep }: StepReviewProps) {
  const details = form.details;
  const schemaFields = form.category ? PORTFOLIO_SCHEMAS[form.category].flatMap((s) => s.fields) : [];

  return (
    <div className="space-y-4">
      <Card title="Overview" onEdit={() => onGoToStep(0)}>
        <Row label="Category" value={form.category ? CATEGORY_LABELS[form.category] : ""} />
        <Row label="Headline" value={form.headline} />
        <Row label="Experience" value={form.experienceYears ? `${form.experienceYears} years` : ""} />
        <Row label="Availability" value={form.availability} />
        <Row label="Summary" value={form.bio} />
      </Card>

      <Card title="Identity" onEdit={() => onGoToStep(1)}>
        <Row label="Full name" value={form.fullName} />
        <Row label="Display name" value={form.displayName} />
        <Row label="Phone" value={form.phone} />
        <Row label="Location" value={[form.tole, form.municipality, form.district].filter(Boolean).join(", ")} />
      </Card>

      <Card title="Expertise" onEdit={() => onGoToStep(2)}>
        {schemaFields.map((f) => {
          const v = details[f.key];
          const display = typeof v === "boolean" ? (v ? "Yes" : "No") : (v as React.ReactNode);
          return <Row key={f.key} label={f.label} value={display} />;
        })}
      </Card>

      <Card title="Reach & links" onEdit={() => onGoToStep(3)}>
        <Row label="Service areas" value={form.serviceAreas} />
        <Row label="Languages" value={form.languages} />
        <Row label="Preferred contact" value={form.preferredContact} />
        <Row label="Fee" value={[form.feeModel, form.feeAmount && `NPR ${form.feeAmount}`].filter(Boolean).join(" · ")} />
      </Card>

      <Card title="Work" onEdit={() => onGoToStep(4)}>
        <Row label="Projects" value={form.projects.length ? `${form.projects.length} added` : "None yet"} />
      </Card>
    </div>
  );
}
