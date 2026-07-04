"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import {
  INITIAL_PORTFOLIO_FORM, fetchPortfolioById, fetchMyPortfolio, mapApiToForm, savePortfolio,
  type PortfolioFormData,
} from "@/lib/portfolio-api";
import { CATEGORY_LABELS, PORTFOLIO_SCHEMAS, isFieldVisible } from "@/lib/portfolio-schemas";
import { StepIntro } from "./components/steps/StepIntro";
import { StepIdentity } from "./components/steps/StepIdentity";
import { StepExpertise } from "./components/steps/StepExpertise";
import { StepReach } from "./components/steps/StepReach";
import { StepWork } from "./components/steps/StepWork";
import { StepReview } from "./components/steps/StepReview";

const DRAFT_KEY = "nirmix_portfolio_draft";
const STEP_LABELS = ["Profession", "Identity", "Expertise", "Reach", "Work", "Review"];

interface Props {
  editId?: string;
}

export function PortfolioCreateWizard({ editId }: Props) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // The portfolio being edited — either the one passed in, or the user's existing
  // one auto-detected in create mode (one portfolio per user).
  const [resolvedId, setResolvedId] = useState<string | undefined>(editId);
  const isEdit = !!resolvedId;

  const [form, setForm] = useState<PortfolioFormData>(INITIAL_PORTFOLIO_FORM);
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [hydrating, setHydrating] = useState(true);

  const update = (patch: Partial<PortfolioFormData>) => setForm((prev) => ({ ...prev, ...patch }));

  // Hydrate: edit mode fetches the portfolio; create mode seeds identity from the
  // logged-in user and restores any saved draft.
  useEffect(() => {
    if (authLoading) return;
    let active = true;

    const identityFromUser = {
      fullName: user?.name ?? "",
      displayName: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.contact ?? "",
    };

    const run = async () => {
      if (editId) {
        const api = await fetchPortfolioById(editId);
        if (active && api) setForm(mapApiToForm(api, identityFromUser));
      } else {
        // Create mode: if the user already has a portfolio, open it for editing
        // (one portfolio per user) instead of letting them create a duplicate.
        const existing = await fetchMyPortfolio().catch(() => null);
        if (active && existing) {
          setForm(mapApiToForm(existing, identityFromUser));
          setResolvedId(existing._id);
          toast.info("You already have a portfolio — editing it.");
        } else if (active) {
          let restored: Partial<PortfolioFormData> = {};
          try {
            const raw = localStorage.getItem(DRAFT_KEY);
            if (raw) restored = JSON.parse(raw);
          } catch { /* ignore malformed draft */ }
          setForm({ ...INITIAL_PORTFOLIO_FORM, ...identityFromUser, ...restored });
        }
      }
      if (active) setHydrating(false);
    };
    run();
    return () => { active = false; };
  }, [authLoading, editId, user]);

  const stepMeta = useMemo(() => {
    const cat = form.category ? CATEGORY_LABELS[form.category] : "Professional";
    return [
      { title: "What do you do?", desc: "Pick your profession and a headline that sells you." },
      { title: "Your details", desc: "Verified personal details that stay on your account." },
      { title: `${cat} expertise`, desc: "The credentials and services clients care about most." },
      { title: "Reach & links", desc: "Where you work, and how clients get in touch." },
      { title: "Your work", desc: "Showcase completed projects — photos win enquiries." },
      { title: "Review & publish", desc: "Give it a final look, then go live." },
    ];
  }, [form.category]);

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!form.category) e.category = "Choose a profession to continue.";
      if (!form.headline.trim()) e.headline = "A headline is required.";
    }
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = "Full name is required.";
      if (!form.displayName.trim()) e.displayName = "Display name is required.";
      if (!form.phone.trim()) e.phone = "Phone is required.";
    }
    if (s === 2 && form.category) {
      for (const section of PORTFOLIO_SCHEMAS[form.category]) {
        for (const f of section.fields) {
          if (!f.required || !isFieldVisible(f, form.details)) continue;
          const v = form.details[f.key];
          const empty = v === undefined || v === "" || (Array.isArray(v) && v.length === 0);
          if (empty) e[`details.${f.key}`] = `${f.label} is required.`;
        }
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) {
      toast.error("Please complete the required fields.");
      return;
    }
    setStep((s) => Math.min(STEP_LABELS.length - 1, s + 1));
  };
  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goToStep = (i: number) => {
    // allow jumping back freely; forward only through validation
    if (i <= step || validateStep(step)) setStep(i);
  };

  const close = () => router.push("/dashboard");

  const saveDraft = () => {
    const { projects, coverImage, ...rest } = form;
    const slim = {
      ...rest,
      // strip un-serializable File/blob previews from the draft
      projects: projects.map((p) => ({ ...p, images: p.images.filter((i) => i.publicId) })),
      coverImage: coverImage?.publicId ? coverImage : undefined,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(slim));
    toast.success("Draft saved.");
  };

  const buildFormData = (): FormData => {
    const fd = new FormData();
    const projectFiles: File[] = [];
    const projects = form.projects.map((p) => {
      const existing = p.images.filter((i) => i.publicId).map((i) => ({ url: i.url, publicId: i.publicId }));
      const fresh = p.images.filter((i) => i.file);
      fresh.forEach((i) => i.file && projectFiles.push(i.file));
      return {
        title: p.title, type: p.type, role: p.role, district: p.district,
        year: p.year, duration: p.duration, valueRange: p.valueRange, description: p.description,
        images: existing, newImageCount: fresh.length,
      };
    });

    const payload = {
      category: form.category,
      headline: form.headline,
      availability: form.availability,
      bio: form.bio,
      experienceYears: form.experienceYears ? Number(form.experienceYears) : undefined,
      serviceAreas: form.serviceAreas,
      languages: form.languages,
      preferredContact: form.preferredContact,
      feeModel: form.feeModel,
      feeAmount: form.feeAmount ? Number(form.feeAmount) : undefined,
      details: form.details,
      socials: form.socials,
      identity: {
        fullName: form.fullName, displayName: form.displayName, dob: form.dob, gender: form.gender,
        phone: form.phone, citizenshipNo: form.citizenshipNo,
        address: { province: form.province, district: form.district, municipality: form.municipality, ward: form.ward, tole: form.tole },
      },
      projects,
    };

    fd.append("data", JSON.stringify(payload));
    if (form.coverImage?.file) fd.append("coverImage", form.coverImage.file);
    projectFiles.forEach((f) => fd.append("projectImages", f));
    return fd;
  };

  const publish = async () => {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) {
      toast.error("Some required fields are missing — check the earlier steps.");
      return;
    }
    setSubmitting(true);
    try {
      await savePortfolio(buildFormData(), resolvedId);
      if (!isEdit) localStorage.removeItem(DRAFT_KEY);
      setSuccess(true);
      toast.success(isEdit ? "Portfolio updated." : "Portfolio published.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save portfolio.");
    } finally {
      setSubmitting(false);
    }
  };

  const stepProps = { form, update, errors };

  if (hydrating) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#B05B33]" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-[#2E2116]">
          {isEdit ? "Portfolio updated" : "Portfolio published"}
        </h2>
        <p className="mt-2 text-sm text-[#8A7A67]">
          Your professional profile is now part of NirMix. Clients can discover and contact you directly.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button onClick={() => router.push("/dashboard")} className="rounded-xl bg-[#2E2116] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#3A2C1E]">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isLast = step === STEP_LABELS.length - 1;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="h-[2px] w-6 bg-[#B05B33]" />
            <span className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#B05B33]">
              {isEdit ? "Edit portfolio" : "Build your portfolio"}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#2E2116] sm:text-3xl">
            {isEdit ? "Update your professional profile" : "Create your professional profile"}
          </h1>
        </div>
        <div className="flex gap-2">
          <button onClick={saveDraft} className="rounded-xl border border-[#E4DCD0] bg-white px-4 py-2 text-[13px] font-semibold text-[#5C4D3C] transition hover:border-[#C9B79F]">
            Save draft
          </button>
          <button onClick={close} className="flex items-center gap-1 rounded-xl border border-[#E4DCD0] bg-white px-4 py-2 text-[13px] font-semibold text-[#5C4D3C] transition hover:border-[#C9B79F]">
            <X className="h-3.5 w-3.5" /> Cancel
          </button>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto pb-1">
        {STEP_LABELS.map((label, i) => {
          const done = step > i;
          const active = step === i;
          return (
            <div key={label} className="flex items-center">
              {i > 0 && <div className={`h-[2px] w-5 sm:w-8 ${done ? "bg-emerald-500" : "bg-[#E4DCD0]"}`} />}
              <button
                type="button"
                onClick={() => goToStep(i)}
                className="flex items-center gap-2 whitespace-nowrap px-2 py-1"
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-colors ${
                    done ? "bg-emerald-500 text-white"
                      : active ? "bg-[#B05B33] text-white"
                        : "bg-[#EAE3D8] text-[#9A8A78]"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : i + 1}
                </span>
                <span className={`text-[12px] font-bold ${active ? "text-[#2E2116]" : "text-[#9A8A78]"}`}>{label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Card */}
      <div className="rounded-3xl border border-[#EAE3D8] bg-[#FBF8F3] p-5 shadow-[0_2px_8px_rgba(46,33,22,0.05)] sm:p-7">
        <div className="mb-6">
          <h2 className="text-lg font-extrabold text-[#2E2116]">{stepMeta[step].title}</h2>
          <p className="mt-0.5 text-[13px] text-[#8A7A67]">{stepMeta[step].desc}</p>
        </div>

        {step === 0 && <StepIntro {...stepProps} />}
        {step === 1 && <StepIdentity {...stepProps} />}
        {step === 2 && <StepExpertise {...stepProps} />}
        {step === 3 && <StepReach {...stepProps} />}
        {step === 4 && <StepWork {...stepProps} />}
        {step === 5 && <StepReview {...stepProps} onGoToStep={goToStep} />}
      </div>

      {/* Footer nav */}
      <div className="mt-5 flex items-center justify-between">
        <button
          onClick={goBack}
          disabled={step === 0}
          className="flex items-center gap-1.5 rounded-xl border border-[#E4DCD0] bg-white px-5 py-2.5 text-sm font-semibold text-[#5C4D3C] transition hover:border-[#C9B79F] disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {isLast ? (
          <button
            onClick={publish}
            disabled={submitting}
            className="flex items-center gap-2 rounded-xl bg-[#B05B33] px-7 py-2.5 text-sm font-bold text-white transition hover:bg-[#9a4c28] disabled:opacity-70"
          >
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> {isEdit ? "Saving…" : "Publishing…"}</> : isEdit ? "Save changes" : "Publish portfolio"}
          </button>
        ) : (
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 rounded-xl bg-[#B05B33] px-7 py-2.5 text-sm font-bold text-white transition hover:bg-[#9a4c28]"
          >
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
