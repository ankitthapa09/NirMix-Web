import { API_BASE } from "./property-api";
import { apiFetch } from "./api-client";
import { CATEGORY_LABELS, type PortfolioCategory } from "./portfolio-schemas";

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

export interface ApiOwner {
  _id: string;
  name: string;
  displayName?: string;
  email?: string;
  contact?: string;
  avatar?: string;
  address?: { province?: string; district?: string; municipality?: string; ward?: string; tole?: string };
  isVerified?: boolean;
  isEmailVerified?: boolean;
}

export interface ApiPortfolio {
  _id: string;
  owner: string | ApiOwner;
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

// ── Public directory / profile (no auth — safe in server components) ──────────

export interface PublicOwner {
  name: string; // display name if set, else the account name
  legalName: string;
  avatar?: string;
  email?: string;
  contact?: string;
  location: string;
  verified: boolean;
}

export interface PublicPortfolio {
  id: string;
  referenceId?: string;
  category: PortfolioCategory;
  categoryLabel: string;
  headline: string;
  availability: string;
  bio: string;
  experienceYears?: number;
  serviceAreas: string[];
  languages: string[];
  preferredContact: string;
  feeModel: string;
  feeAmount?: number;
  details: Record<string, unknown>;
  socials: PortfolioSocials;
  projects: PortfolioProject[];
  coverImage?: PortfolioMedia;
  owner: PublicOwner;
  createdAt: string;
}

/** Map a raw API portfolio (owner populated) onto the public-facing UI shape. */
export function mapApiToPublic(api: ApiPortfolio): PublicPortfolio {
  const owner = typeof api.owner === "object" ? api.owner : undefined;
  const addr = owner?.address;
  const location = [addr?.tole, addr?.municipality, addr?.district].filter(Boolean).join(", ");

  return {
    id: api._id,
    referenceId: api.referenceId,
    category: api.category,
    categoryLabel: CATEGORY_LABELS[api.category] ?? "Professional",
    headline: api.headline ?? "",
    availability: api.availability ?? "",
    bio: api.bio ?? "",
    experienceYears: api.experienceYears,
    serviceAreas: api.serviceAreas ?? [],
    languages: api.languages ?? [],
    preferredContact: api.preferredContact ?? "",
    feeModel: api.feeModel ?? "",
    feeAmount: api.feeAmount,
    details: api.details ?? {},
    socials: { ...EMPTY_SOCIALS, ...(api.socials ?? {}) },
    projects: (api.projects ?? []).map((p) => ({ ...p, localId: nextLocalId() })),
    coverImage: api.coverImage,
    owner: {
      name: owner?.displayName || owner?.name || "NirMix Professional",
      legalName: owner?.name ?? "",
      avatar: owner?.avatar,
      email: owner?.email,
      contact: owner?.contact,
      location,
      verified: !!owner?.isVerified,
    },
    createdAt: api.createdAt,
  };
}

/** Fetch active portfolios for the public directory, optionally filtered by category. */
export async function fetchPublicPortfolios(category?: PortfolioCategory): Promise<PublicPortfolio[]> {
  const url = category ? `${API_BASE}/portfolios?category=${category}` : `${API_BASE}/portfolios`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch portfolios");
  const json = await res.json();
  return ((json.data as ApiPortfolio[]) ?? []).map(mapApiToPublic);
}

/** Fetch a single public portfolio by id (null if not found). */
export async function fetchPublicPortfolioById(id: string): Promise<PublicPortfolio | null> {
  try {
    const res = await fetch(`${API_BASE}/portfolios/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ? mapApiToPublic(json.data as ApiPortfolio) : null;
  } catch {
    return null;
  }
}
