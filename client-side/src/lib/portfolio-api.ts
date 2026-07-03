import { API_BASE } from "./property-api";
import { apiFetch } from "./api-client";
import type { PortfolioCategory } from "./portfolio-schemas";

// ── Shared media / project shapes ───────────────────────────────────────────

export interface PortfolioMedia {
  url: string;
  publicId: string;
  /** Present only for not-yet-uploaded local files while editing. */
  file?: File;
}

export interface PortfolioProject {
  /** Local-only id for React keys / list ops; not persisted. */
  localId: string;
  title: string;
  type: string;
  role: string;
  district: string;
  year: string;
  duration: string;
  valueRange: string;
  description: string;
  images: PortfolioMedia[];
}

export interface PortfolioSocials {
  website: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  viber: string;
  whatsapp: string;
  behance: string;
}

// ── Identity (User-owned, edited via the wizard's identity step) ─────────────

export interface PortfolioIdentity {
  fullName: string;
  displayName: string;
  dob: string;
  gender: string;
  email: string; // verified, read-only in the wizard
  phone: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  tole: string;
  citizenshipNo: string;
}

// ── The full wizard form state ───────────────────────────────────────────────

export interface PortfolioFormData extends PortfolioIdentity {
  category: PortfolioCategory | "";
  headline: string;
  availability: string;
  bio: string;
  experienceYears: string;
  serviceAreas: string[];
  languages: string[];
  preferredContact: string;
  feeModel: string;
  feeAmount: string;
  /** Category-specific fields keyed by the schema field keys. */
  details: Record<string, unknown>;
  socials: PortfolioSocials;
  projects: PortfolioProject[];
  coverImage?: PortfolioMedia;
}

export const EMPTY_SOCIALS: PortfolioSocials = {
  website: "", facebook: "", instagram: "", linkedin: "",
  youtube: "", tiktok: "", viber: "", whatsapp: "", behance: "",
};

export const INITIAL_PORTFOLIO_FORM: PortfolioFormData = {
  fullName: "", displayName: "", dob: "", gender: "", email: "", phone: "",
  province: "", district: "", municipality: "", ward: "", tole: "", citizenshipNo: "",
  category: "", headline: "", availability: "", bio: "", experienceYears: "",
  serviceAreas: [], languages: [], preferredContact: "", feeModel: "", feeAmount: "",
  details: {}, socials: { ...EMPTY_SOCIALS }, projects: [], coverImage: undefined,
};

// ── Raw API shape ────────────────────────────────────────────────────────────

export interface ApiPortfolio {
  _id: string;
  owner: string | { _id: string; name: string; email: string; avatar?: string };
  category: PortfolioCategory;
  referenceId?: string;
  status: "draft" | "active" | "hidden";
  headline: string;
  availability?: string;
  bio?: string;
  experienceYears?: number;
  serviceAreas?: string[];
  languages?: string[];
  preferredContact?: string;
  feeModel?: string;
  feeAmount?: number;
  details?: Record<string, unknown>;
  socials?: Partial<PortfolioSocials>;
  projects?: (Omit<PortfolioProject, "localId" | "images"> & { images: PortfolioMedia[] })[];
  coverImage?: PortfolioMedia;
  createdAt: string;
  updatedAt: string;
}

let projectSeq = 0;
const nextLocalId = () => `p_${Date.now()}_${projectSeq++}`;

/** Map a raw API portfolio (+ optional identity from the user) back onto the wizard form for edit mode. */
export function mapApiToForm(
  api: ApiPortfolio,
  identity?: Partial<PortfolioIdentity>,
): PortfolioFormData {
  return {
    ...INITIAL_PORTFOLIO_FORM,
    ...identity,
    category: api.category,
    headline: api.headline ?? "",
    availability: api.availability ?? "",
    bio: api.bio ?? "",
    experienceYears: api.experienceYears != null ? String(api.experienceYears) : "",
    serviceAreas: api.serviceAreas ?? [],
    languages: api.languages ?? [],
    preferredContact: api.preferredContact ?? "",
    feeModel: api.feeModel ?? "",
    feeAmount: api.feeAmount != null ? String(api.feeAmount) : "",
    details: api.details ?? {},
    socials: { ...EMPTY_SOCIALS, ...(api.socials ?? {}) },
    projects: (api.projects ?? []).map((p) => ({ ...p, localId: nextLocalId() })),
    coverImage: api.coverImage,
  };
}

export function newProject(): PortfolioProject {
  return {
    localId: nextLocalId(),
    title: "", type: "", role: "", district: "", year: "",
    duration: "", valueRange: "", description: "", images: [],
  };
}

// ── API calls (backend lands in the server-side phase) ───────────────────────

export async function fetchMyPortfolio(): Promise<ApiPortfolio | null> {
  const res = await apiFetch(`${API_BASE}/portfolios/me`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load your portfolio");
  const json = await res.json();
  return json.data ?? null;
}

export async function fetchPortfolioById(id: string): Promise<ApiPortfolio | null> {
  try {
    const res = await apiFetch(`${API_BASE}/portfolios/${id}`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function savePortfolio(fd: FormData, editId?: string): Promise<ApiPortfolio> {
  const res = await apiFetch(
    editId ? `${API_BASE}/portfolios/${editId}` : `${API_BASE}/portfolios`,
    { method: editId ? "PATCH" : "POST", body: fd },
  );
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Failed to save portfolio");
  return json.data;
}
