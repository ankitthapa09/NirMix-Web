"use client";

import { useRef } from "react";
import { Plus, Trash2, ImagePlus, X } from "lucide-react";
import { newProject, type PortfolioProject, type PortfolioMedia } from "@/lib/portfolio-api";
import { inputCls, labelCls } from "../ui";
import type { StepProps } from "./shared";

function ProjectCard({
  project, index, onChange, onRemove,
}: {
  project: PortfolioProject;
  index: number;
  onChange: (patch: Partial<PortfolioProject>) => void;
  onRemove: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const addImages = (files: FileList | null) => {
    if (!files?.length) return;
    const media: PortfolioMedia[] = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      publicId: "",
      file,
    }));
    onChange({ images: [...project.images, ...media] });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (i: number) => {
    const img = project.images[i];
    if (img?.file && img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
    onChange({ images: project.images.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="rounded-2xl border border-[#EAE3D8] bg-white p-5 shadow-[0_1px_2px_rgba(46,33,22,0.04)]">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="text-[13px] font-bold uppercase tracking-wide text-[#8A7A67]">Project {index + 1}</h4>
        <button type="button" onClick={onRemove} className="flex items-center gap-1 text-[12px] font-semibold text-red-500 hover:text-red-600">
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      </div>

      {/* Image gallery */}
      <div className="mb-4 flex flex-wrap gap-3">
        {project.images.map((img, i) => (
          <div key={i} className="group relative h-24 w-32 overflow-hidden rounded-xl border border-[#EAE3D8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img.url} alt={`Project ${index + 1} image ${i + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-[#D9CDBD] text-[#9A8A78] transition hover:border-[#B05B33] hover:text-[#B05B33]"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-[11px] font-semibold">Add photos</span>
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addImages(e.target.files)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>Project title</label>
          <input type="text" value={project.title} onChange={(e) => onChange({ title: e.target.value })} placeholder="e.g. 3-storey residence, Bhaisepati" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Type</label>
          <input type="text" value={project.type} onChange={(e) => onChange({ type: e.target.value })} placeholder="e.g. Residential" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Your role</label>
          <input type="text" value={project.role} onChange={(e) => onChange({ role: e.target.value })} placeholder="e.g. Structural design & supervision" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>District</label>
          <input type="text" value={project.district} onChange={(e) => onChange({ district: e.target.value })} placeholder="e.g. Lalitpur" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Year</label>
            <input type="text" value={project.year} onChange={(e) => onChange({ year: e.target.value })} placeholder="e.g. 2023" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Duration</label>
            <input type="text" value={project.duration} onChange={(e) => onChange({ duration: e.target.value })} placeholder="e.g. 8 months" className={inputCls} />
          </div>
        </div>
        <div>
          <label className={labelCls}>Project value (NPR)</label>
          <input type="text" value={project.valueRange} onChange={(e) => onChange({ valueRange: e.target.value })} placeholder="e.g. 1.2 crore" className={inputCls} />
        </div>
        <div className="sm:col-span-2">
          <label className={labelCls}>Description</label>
          <textarea value={project.description} onChange={(e) => onChange({ description: e.target.value })} rows={3} placeholder="Scope, challenges, and outcome." className={`${inputCls} resize-y leading-relaxed`} />
        </div>
      </div>
    </div>
  );
}

export function StepWork({ form, update }: StepProps) {
  const updateProject = (localId: string, patch: Partial<PortfolioProject>) =>
    update({ projects: form.projects.map((p) => (p.localId === localId ? { ...p, ...patch } : p)) });

  const removeProject = (localId: string) =>
    update({ projects: form.projects.filter((p) => p.localId !== localId) });

  return (
    <div className="space-y-5">
      <p className="rounded-xl border border-[#EAE3D8] bg-[#FAF7F2] px-4 py-3 text-[12px] leading-relaxed text-[#8A7A67]">
        Showcase your best work. Projects with photos get far more client enquiries — add as many as you like.
      </p>

      {form.projects.map((project, i) => (
        <ProjectCard
          key={project.localId}
          project={project}
          index={i}
          onChange={(patch) => updateProject(project.localId, patch)}
          onRemove={() => removeProject(project.localId)}
        />
      ))}

      <button
        type="button"
        onClick={() => update({ projects: [...form.projects, newProject()] })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#D9CDBD] py-4 text-sm font-semibold text-[#8A7A67] transition hover:border-[#B05B33] hover:text-[#B05B33]"
      >
        <Plus className="h-4 w-4" /> Add {form.projects.length > 0 ? "another " : ""}project
      </button>
    </div>
  );
}
